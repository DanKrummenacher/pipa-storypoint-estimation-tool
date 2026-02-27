import { Component, CUSTOM_ELEMENTS_SCHEMA, input, computed } from '@angular/core';
import { Participant } from '../../../../shared/models/room.model';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-icon';

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
  participants = input<Participant[]>([]);

  estimatedCount = computed(
    () => this.participants().filter((p) => p.hasEstimated).length,
  );
  totalCount = computed(() => this.participants().length);

  getEstimationColor(value: string | undefined): string {
    return ESTIMATION_COLORS[value ?? ''] ?? '#BEBFBF';
  }
}
