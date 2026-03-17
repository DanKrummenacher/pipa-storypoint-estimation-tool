import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Room {
  private apiUrl = `${environment.apiUrl}/rooms`;
  private http = inject(HttpClient);

  createRoom(name: string): Observable<{ roomCode: string; name: string }> {
    return this.http.post<{ roomCode: string; name: string }>(this.apiUrl, { name });
  }

  getRoom(roomCode: string): Observable<{ roomCode: string; name: string }> {
    return this.http.get<{ roomCode: string; name: string }>(
      `${this.apiUrl}/${roomCode}`,
    );
  }
}
