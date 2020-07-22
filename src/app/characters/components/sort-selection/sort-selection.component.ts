import { Component, Input } from '@angular/core';
import { SortSelection } from './SortSelection';

@Component({
  selector: 'app-sort-selection',
  templateUrl: './sort-selection.component.html',
  styleUrls: ['./sort-selection.component.scss']
})
export class SortSelectionComponent {
  @Input() id: string;
  @Input() title = '';
  @Input() selection: SortSelection;
}
