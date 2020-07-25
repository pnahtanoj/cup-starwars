import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ColumnData } from './model/ColumnData';
import { MultiSortSelection } from '@/core/components/sort-selection/model/MultiSortSelection';

const MAGIC_NUMBER_RESIZER_WIDTH = 3;

@Component({
  selector: 'app-click-up-table',
  templateUrl: './click-up-table.component.html',
  styleUrls: ['./click-up-table.component.scss']
})
export class ClickUpTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: any[];
  @Input() columns: ColumnData[];
  @Input() sort: MultiSortSelection;

  @Output() updateColumns = new EventEmitter<ColumnData[]>();
  @Output() toggleSort = new EventEmitter<string>();

  columnsPx: ColumnData[];
  resizerWidthsPx: string[];
  resizeData$: Subject<{ event: any, i: number }> = new Subject();
  sink: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    this.sink.push(
      this.resizeData$
        .pipe(
          debounceTime(50),
          tap(console.log),
          tap(data => this.updateColumnSize(data.i, data.event.distance.x))
        )
        .subscribe()
    );
  }

  ngOnChanges(changes) {
    if (changes.columns && changes.columns.currentValue) {
      const columns = changes.columns.currentValue;
      const widths = columns.map(c => c.width);
      console.log(columns);

      this.columnsPx = this.columns.map(c => ({
        ...c,
        width: `${c.width}px`
      }));

      this.resizerWidthsPx = columns
        .slice(0, 3)
        .map((width, i) => widths
          .reduce((acc, item, j) => (j <= i) ? ((acc + item) - MAGIC_NUMBER_RESIZER_WIDTH) : acc, 0) // not legible or efficient
        )
        .map(width => `${width}px`);
    }
  }

  ngOnDestroy() {
    this.sink.forEach(s => s.unsubscribe());
  }

  toggleSortColumn(column: any) {
    this.toggleSort.emit(column);
  }

  drop(event: CdkDragDrop<string[]>) {
    const columns = this.columns.map(c => ({ ...c }));
    moveItemInArray(columns, event.previousIndex, event.currentIndex);

    this.updateColumns.emit(columns);
  }

  updateColumnSize(index: number, deltax: number) {
    const leftWidth = Number(this.columns[index].width) + deltax;
    const rightWidth = Number(this.columns[index + 1].width) + (-1 * deltax);
    const columns = this.columns.map(c => ({ ...c }));

    columns[index].width = leftWidth;
    columns[index + 1].width = rightWidth;

    this.updateColumns.emit(columns);
  }

  resizerMoving(event: any, i: number) {
    this.resizeData$.next({ event, i });
  }
}
