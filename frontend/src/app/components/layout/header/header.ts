import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import '@css-ch/calc-ui-logo';

@Component({
  selector: 'app-header',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  mode = input<'lobby' | 'room'>('lobby');
  roomName = input('');
  roomId = input('');
  userName = input('');

  leaveRoom = output<void>();
  copyId = output<string>();
}
