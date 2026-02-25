import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../../core/room';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lobby',
  imports: [FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby {
  private roomService = inject(Room);
  private router = inject(Router);

  roomName = signal('');
  userName = signal('');
  joinRoomCode = signal('');

  createRoom() {
    this.roomService.createRoom(this.roomName()).subscribe((res) => {
      this.saveUserData();
      this.router.navigate(['/room', res.roomCode]);
    });
  }

  joinRoom() {
    this.saveUserData();
    this.router.navigate(['/room', this.joinRoomCode()]);
  }

  private saveUserData() {
    localStorage.setItem('userName', this.userName());
    localStorage.setItem('userId', crypto.randomUUID());
  }
}
