import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Header } from '../../components/layout/header/header';
import {
  Participant,
  ParticipantGrid,
} from './components/participant-grid/participant-grid';
import { CardSelection } from './components/card-selection/card-selection';
import { ResultSummary } from './components/result-summary/result-summary';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-icon';

@Component({
  selector: 'app-estimation-room',
  imports: [ Header, ParticipantGrid, CardSelection, ResultSummary],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './estimation-room.html',
  styleUrl: './estimation-room.scss',
})
export class EstimationRoom {
  isRevealed = signal(false);

  roomName = signal('Sprint 67 Refinement');
  roomId = signal('AGQ367');
  userName = signal('Max Mustermann');

  participants = signal<Participant[]>([
    { name: 'Max (Du)', hasEstimated: true, isRevealed: false },
    { name: 'Liechti', hasEstimated: false, isRevealed: false },
    { name: 'Sebastian', hasEstimated: true, isRevealed: false },
  ]);

  estimatedCount = signal(1);
  totalCount = signal(3);

  onCardSelected(value: string) {
    console.log('User hat Karte gewählt:', value);
  }

  toggleReveal() {
    this.isRevealed.set(true);
  }

  resetRound() {
    this.isRevealed.set(false);
  }
}
