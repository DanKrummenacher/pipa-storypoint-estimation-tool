import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }
}
