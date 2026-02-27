import { Injectable } from '@angular/core';
import { io, Socket as IoSocket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Socket {
  private socket?: IoSocket;

  roomState$ = new BehaviorSubject<any>(null);

  connect() {
    if (this.socket) return;

    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connected:', this.socket?.id);
    });

    this.socket.on('roomState', (data) => {
      this.roomState$.next(data);
    });

    this.socket.on('roomError', (err) => {
      console.error('Room Error:', err);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }

  joinRoom(roomCode: string, userId: string, name: string) {
    this.ensureConnected();
    this.socket?.emit('joinRoom', { roomCode, userId, name });
  }

  vote(roomCode: string, userId: string, value: number) {
    this.ensureConnected();
    this.socket?.emit('vote', { roomCode, userId, value });
  }

  reveal(roomCode: string) {
    this.ensureConnected();
    this.socket?.emit('reveal', { roomCode });
  }

  reset(roomCode: string) {
    this.ensureConnected();
    this.socket?.emit('reset', { roomCode });
  }

  leaveRoom(roomCode: string, userId: string) {
    this.ensureConnected();
    this.socket?.emit('leaveRoom', { roomCode, userId });
  }

  private ensureConnected() {
    if (!this.socket) {
      this.connect();
    }
  }
}
