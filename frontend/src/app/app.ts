import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from './core/api.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  status = 'Loading...';
  private apiService = inject(ApiService);

  ngOnInit() {
    this.apiService.getHealth().subscribe({
      next: (data) => (this.status = data.status),
      error: (err) => {
        console.error(err);
        this.status = 'Error: Backend not available';
      },
    });
  }
}
