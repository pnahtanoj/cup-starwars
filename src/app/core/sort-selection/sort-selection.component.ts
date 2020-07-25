import { Component, Input, OnChanges } from '@angular/core';
import { SortDirection } from './model/SortSelection';
import { MultiSortSelection } from './model/MultiSortSelection';

@Component({
  selector: 'app-sort-selection',
  templateUrl: './sort-selection.component.html',
  styleUrls: ['./sort-selection.component.scss']
})
export class SortSelectionComponent implements OnChanges {
  @Input() sort: MultiSortSelection;
  @Input() id: string;

  title: number;
  direction: SortDirection;

  constructor() { }

  ngOnChanges(changes) {
    if (changes.sort) {
      const matchIdx = this.sort.selections.findIndex(s => s.column === this.id);
      if (matchIdx > -1) {
        this.title = matchIdx + 1;
        this.direction = this.sort.selections[matchIdx].direction;
      } else {
        this.title = 0;
      }
    }
  }

}
