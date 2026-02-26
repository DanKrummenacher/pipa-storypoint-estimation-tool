import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import '@css-ch/calc-ui-button';
import '@css-ch/calc-ui-text';
import '@css-ch/calc-ui-icon';

@Component({
  selector: 'app-result-summary',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './result-summary.html',
  styleUrl: './result-summary.scss',
})
export class ResultSummary {
  mostFrequent = input('–');
  average = input('–');
  recommendation = input('–');

  nextRound = output<void>();
}
