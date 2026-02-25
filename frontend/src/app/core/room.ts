import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Room {
  private apiUrl = 'http://localhost:3000/rooms';
  private http = inject(HttpClient);

  createRoom(name: string): Observable<{ roomCode: string; name: string }> {
    return this.http.post<{ roomCode: string; name: string }>(this.apiUrl, { name });
  }
}
