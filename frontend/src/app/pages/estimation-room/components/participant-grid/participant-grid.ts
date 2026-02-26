import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-icon';

export interface Participant {
  name: string;
  hasEstimated: boolean;
  isRevealed: boolean;
  estimationValue?: string;
}

const ESTIMATION_COLORS: Record<string, string> = {
  '?': '#BEBFBF',
  '1/2': '#849E7A',
  '1': '#8CB876',
  '2': '#96BA5B',
  '3': '#B5C76B',
  '5': '#C9C857',
  '8': '#E0C957',
  '13': '#D6CDA1',
  '21': '#A0A6BD',
  '34': '#6A80AB',
};

@Component({
  selector: 'app-participant-grid',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './participant-grid.html',
  styleUrl: './participant-grid.scss',
})
export class ParticipantGrid {
  estimatedCount = input(0);
  totalCount = input(0);

  participants = input<Participant[]>([
    { name: 'Max Muster', hasEstimated: false, isRevealed: false },
    { name: 'Erika Muster', hasEstimated: true, isRevealed: false },
    { name: 'John Doe', hasEstimated: true, isRevealed: true, estimationValue: '5' },
    {
      name: 'Sarah Müller',
      hasEstimated: true,
      isRevealed: true,
      estimationValue: '21',
    },
    { name: 'Peter Lang', hasEstimated: false, isRevealed: false },
    {
      name: 'Anna Koch',
      hasEstimated: true,
      isRevealed: true,
      estimationValue: '8',
    },
  ]);

  getEstimationColor(value: string | undefined): string {
    return ESTIMATION_COLORS[value ?? ''] ?? '#BEBFBF';
  }
}
