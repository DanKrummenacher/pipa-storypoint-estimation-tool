import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Socket } from '../../core/socket';

@Component({
  selector: 'app-estimation-room',
  imports: [AsyncPipe],
  templateUrl: './estimation-room.html',
  styleUrl: './estimation-room.scss',
})
export class EstimationRoom implements OnInit {
  private route = inject(ActivatedRoute);
  private socket = inject(Socket);

  fibonacci = ['?', 0.5, 1, 2, 3, 5, 8, 13, 21, 34];

  userId = localStorage.getItem('userId')!;
  roomCode!: string;
  roomState$ = this.socket.roomState$;

  ngOnInit() {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode')!;

    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    if (!userName || !userId) {
      window.location.href = '/';
      return;
    }

    this.socket.connect();
    this.socket.joinRoom(this.roomCode, userId, userName);
  }

  vote(value: number | string) {
    if (value === '?') return;

    this.socket.vote(this.roomCode, this.userId, Number(value));
  }

  reveal() {
    this.socket.reveal(this.roomCode);
  }

  reset() {
    this.socket.reset(this.roomCode);
  }

  leave() {
    this.socket.leaveRoom(this.roomCode, this.userId);
    localStorage.clear();
    window.location.href = '/';
  }
}
