import { Injectable } from '@angular/core';
import { io, Socket as IoSocket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Socket {
  private socket!: IoSocket;

  roomState$ = new BehaviorSubject<any>(null);

  connect() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connected:', this.socket.id);
    });

    this.socket.on('roomState', (data) => {
      this.roomState$.next(data);
    });

    this.socket.on('roomError', (err) => {
      console.error(err);
    });
  }

  joinRoom(roomCode: string, userId: string, name: string) {
    this.socket.emit('joinRoom', { roomCode, userId, name });
  }

  vote(roomCode: string, userId: string, value: number) {
    this.socket.emit('vote', { roomCode, userId, value });
  }

  reveal(roomCode: string) {
    this.socket.emit('reveal', { roomCode });
  }

  reset(roomCode: string) {
    this.socket.emit('reset', { roomCode });
  }

  leaveRoom(roomCode: string, userId: string) {
    this.socket.emit('leaveRoom', { roomCode, userId });
  }
}
