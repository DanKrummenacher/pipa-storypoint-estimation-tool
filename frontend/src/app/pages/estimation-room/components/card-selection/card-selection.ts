import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { EstimationCard } from '../../../../shared/models/room.model';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-button';
import '@css-ch/calc-ui-icon';

@Component({
  selector: 'app-card-selection',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './card-selection.html',
  styleUrl: './card-selection.scss',
})
export class CardSelection {
  cardSelected = output<string>();
  revealCards = output<void>();
  selectedCard = input<string | undefined>();

  readonly availableCards: EstimationCard[] = [
    { value: '?', color: '#BEBFBF' },
    { value: '1/2', color: '#849E7A' },
    { value: '1', color: '#8CB876' },
    { value: '2', color: '#96BA5B' },
    { value: '3', color: '#B5C76B' },
    { value: '5', color: '#C9C857' },
    { value: '8', color: '#E0C957' },
    { value: '13', color: '#D6CDA1' },
    { value: '21', color: '#A0A6BD' },
    { value: '34', color: '#6A80AB' },
  ];
}
