import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import '@css-ch/calc-ui-toggle-group';
import '@css-ch/calc-ui-input-text';
import '@css-ch/calc-ui-notification';
import '@css-ch/calc-ui-button';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-icon';

@Component({
  selector: 'app-join-card',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './join-card.html',
  styleUrl: './join-card.scss',
})
export class JoinCard {
  createRoom = output<{ roomName: string; userName: string }>();
  joinRoom = output<{ roomCode: string; userName: string }>();

  selectedMode = signal<'create' | 'join'>('create');
  showNotification = signal(true);

  roomName = signal('');
  userName = signal('');
  roomCode = signal('');
  roomCodeError = input<string | undefined>();
  initialRoomCode = input<string | undefined>();

  constructor() {
    effect(() => {
      const code = this.initialRoomCode();
      if (code) {
        this.selectedMode.set('join');
        this.roomCode.set(code);
      }
    });
  }

  toggleOptions = [
    { label: 'Raum erstellen', value: 'create' },
    { label: 'Raum beitreten', value: 'join' },
  ];

  handleModeChange(event: Event) {
    const detail = (event as CustomEvent<string>).detail;
    this.selectedMode.set(detail as 'create' | 'join');
  }

  closeNotification() {
    this.showNotification.set(false);
  }

  updateRoomName(event: Event) {
    this.roomName.set((event as CustomEvent<string>).detail);
  }

  updateUserName(event: Event) {
    this.userName.set((event as CustomEvent<string>).detail);
  }

  updateRoomCode(event: Event) {
    this.roomCode.set((event as CustomEvent<string>).detail);
  }

  submit() {
    if (this.selectedMode() === 'create') {
      if (this.roomName().trim() && this.userName().trim()) {
        this.createRoom.emit({
          roomName: this.roomName(),
          userName: this.userName(),
        });
      }
    } else {
      if (this.roomCode().trim() && this.userName().trim()) {
        this.joinRoom.emit({
          roomCode: this.roomCode(),
          userName: this.userName(),
        });
      }
    }
  }
}
