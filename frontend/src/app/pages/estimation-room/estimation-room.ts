import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Header } from '../../components/layout/header/header';
import { ParticipantGrid } from './components/participant-grid/participant-grid';
import { CardSelection } from './components/card-selection/card-selection';
import { ResultSummary } from './components/result-summary/result-summary';
import { Socket } from '../../core/socket';
import { Room } from '../../core/room';
import { Participant, RoomState } from '../../shared/models/room.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-icon';

@Component({
  selector: 'app-estimation-room',
  imports: [Header, ParticipantGrid, CardSelection, ResultSummary],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './estimation-room.html',
  styleUrl: './estimation-room.scss',
})
export class EstimationRoom implements OnInit, OnDestroy {
  private socket = inject(Socket);
  private roomService = inject(Room);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);

  roomName = signal('');
  roomCode = signal('');
  userName = signal('');
  userId = signal('');
  status = signal<'voting' | 'revealed'>('voting');
  participants = signal<Participant[]>([]);
  results = signal<{
    average: string;
    mostCommon: string;
    recommendation: string;
  } | null>(null);

  constructor() {
    this.socket.roomState$
      .pipe(takeUntilDestroyed())
      .subscribe((state: RoomState | null) => {
        if (state) {
          this.roomName.set(state.name);
          this.roomCode.set(state.roomCode);
          this.status.set(state.status);

          const mappedParticipants: Participant[] = state.participants.map((p) => ({
            id: p.userId,
            name: p.name,
            hasEstimated: p.vote !== null,
            isRevealed: state.status === 'revealed',
            isMe: p.userId === this.userId(),
            estimationValue: this.mapNumericToValue(p.vote),
          }));

          this.participants.set(mappedParticipants);

          if (state.results) {
            this.results.set({
              average: state.results.average?.toString() || '–',
              mostCommon: this.mapNumericToValue(state.results.mostCommon) || '–',
              recommendation: state.results.recommendation?.toString() || '–',
            });
          } else {
            this.results.set(null);
          }
        }
      });
  }

  private mapNumericToValue(value: number | null): string | undefined {
    if (value === null) return undefined;
    if (value === 0) return '?';
    if (value === 0.5) return '1/2';
    return value.toString();
  }

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('roomCode');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    if (!code || !storedUserName || !storedUserId) {
      this.router.navigate(['/'], { queryParams: { roomCode: code } });
      return;
    }

    this.roomService.getRoom(code).subscribe({
      next: (room) => {
        this.roomCode.set(room.roomCode);
        this.roomName.set(room.name);
        this.titleService.setTitle(`Raum - ${room.name}`);
        this.userName.set(storedUserName);
        this.userId.set(storedUserId);

        this.socket.connect();
        this.socket.joinRoom(room.roomCode, storedUserId, storedUserName);
      },
      error: () => this.router.navigate(['/']),
    });
  }

  getUserVote(): string | undefined {
    return this.participants().find((p) => p.isMe)?.estimationValue;
  }

  leaveRoom() {
    this.router.navigate(['/']);
  }

  copyRoomCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  ngOnDestroy() {
    this.socket.leaveRoom(this.roomCode(), this.userId());
  }

  onCardSelected(value: string) {
    const numericValue = value === '1/2' ? 0.5 : value === '?' ? 0 : parseInt(value);
    this.socket.vote(this.roomCode(), this.userId(), numericValue);
  }

  toggleReveal() {
    this.socket.reveal(this.roomCode());
  }

  resetRound() {
    this.socket.reset(this.roomCode());
  }
}
