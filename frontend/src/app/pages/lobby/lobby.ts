import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../../core/room';
import { FormsModule } from '@angular/forms';
import '@css-ch/calc-ui-button';
import '@css-ch/calc-ui-switch';
import { Header } from '../../components/layout/header/header';
import { JoinCard } from './components/join-card/join-card';
import { InfoSteps } from './components/info-steps/info-steps';

@Component({
  selector: 'app-lobby',
  imports: [FormsModule, Header, JoinCard, InfoSteps],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
