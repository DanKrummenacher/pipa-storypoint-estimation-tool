import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@css-ch/calc-ui-toggle-group';
import '@css-ch/calc-ui-input-text';
import '@css-ch/calc-ui-notification';
import '@css-ch/calc-ui-button';
import '@css-ch/calc-ui-text';

@Component({
  selector: 'app-join-card',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './join-card.html',
  styleUrl: './join-card.scss',
})
export class JoinCard {
  toggleOptions = [
    { label: 'Raum erstellen', value: 'create' },
    { label: 'Raum beitreten', value: 'join' },
  ];

  selectedMode = 'create';
  showNotification = true;

  onModeChange(event: any) {
    this.selectedMode = event.detail;
  }

  closeNotification() {
    this.showNotification = false;
  }
}
