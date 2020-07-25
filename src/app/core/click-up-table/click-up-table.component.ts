import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CutColumnData } from './model/ColumnData';
import { MultiSortSelection } from '../sort-selection/MultiSortSelection';
import { ColumnDrop } from './model/ColumnDrop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { updateColumnWidth } from 'src/app/characters/store/characters.reducer';
import { tableColumns } from 'src/app/characters/store/characters.selectors';

const MAGIC_NUMBER_RESIZER_WIDTH = 3;

@Component({
  selector: 'app-click-up-table',
  templateUrl: './click-up-table.component.html',
  styleUrls: ['./click-up-table.component.scss']
})
export class ClickUpTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: any[];
  @Input() columns: CutColumnData[];
  @Input() sort: MultiSortSelection;

  @Output() dropColumn = new EventEmitter<ColumnDrop>();
  @Output() toggleSort = new EventEmitter<string>();

  resizerWidths: string[];
  resizeData$: Subject<{ event: any, i: number }> = new Subject();
  sink: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    this.sink.push(
      this.resizeData$
        .pipe(
          debounceTime(50),
          tap(console.log),
          // tap(data => this.store.dispatch(updateColumnWidth({ index: data.i, deltax: data.event.distance.x })))
        )
        .subscribe()
    );
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.columns && changes.columns.currentValue) {
      const columns = changes.columns.currentValue;
      const widths = columns.map(c => c.width);
      console.log(columns);

      this.columns = this.columns.map(c => ({
        ...c,
        width: `${c.width}px`
      }));

      this.resizerWidths = columns
        .slice(0, 3)
        .map((width, i) => widths
          .reduce((acc, item, j) => (j <= i) ? ((acc + item) - MAGIC_NUMBER_RESIZER_WIDTH) : acc, 0) // not very efficient
        )
        .map(width => `${width}px`);

      console.log(this.resizerWidths);
    }
  }

  ngOnDestroy() {
    this.sink.forEach(s => s.unsubscribe());
  }

  toggleSortColumn(column: any) {
    this.toggleSort.emit(column);
  }

  drop(event: CdkDragDrop<string[]>) {
    const columns = [...this.columns]
    moveItemInArray(columns, event.previousIndex, event.currentIndex);

    // const columnWidths = [...state.columnWidths];
    // moveItemInArray(columnWidths, drop.previous, drop.current);


    // this.dropColumn.emit({ previous: event.previousIndex, current: event.currentIndex });
  }

  resizerMoving(event: any, i: number) {
    this.resizeData$.next({ event, i });
  }
}
