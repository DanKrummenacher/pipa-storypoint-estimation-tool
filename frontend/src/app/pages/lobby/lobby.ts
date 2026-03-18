import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Room } from '../../core/room';
import { Header } from '../../components/layout/header/header';
import { JoinCard } from './components/join-card/join-card';
import { InfoSteps } from './components/info-steps/info-steps';

@Component({
  selector: 'app-lobby',
  imports: [Header, JoinCard, InfoSteps],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby implements OnInit {
  private roomService = inject(Room);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('Schätze deine User Stories');
  }

  roomError = signal<string | undefined>(undefined);
  initialRoomCode = signal<string | undefined>(
    this.route.snapshot.queryParams['roomCode'],
  );

  handleCreateRoom(data: { roomName: string; userName: string }) {
    this.roomError.set(undefined);
    this.saveUserData(data.userName);
    this.roomService.createRoom(data.roomName).subscribe({
      next: (res) => {
        this.router.navigate(['/room', res.roomCode]);
      },
      error: (err) => {
        console.error('Error creating room:', err);
      },
    });
  }

  handleJoinRoom(data: { roomCode: string; userName: string }) {
    this.roomError.set(undefined);
    this.roomService.getRoom(data.roomCode).subscribe({
      next: () => {
        this.saveUserData(data.userName);
        this.router.navigate(['/room', data.roomCode]);
      },
      error: () => {
        this.roomError.set('Raum-ID existiert nicht.');
      },
    });
  }

  private saveUserData(userName: string) {
    localStorage.setItem('userName', userName);
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('userId', userId);
    }
  }
}
