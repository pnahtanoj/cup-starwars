// https://stackblitz.com/edit/angular-4secmm?file=src%2Fapp%2Fapp.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { fetchCharacters, toggleSort, updateFilter, updateTableWidth, swapColumns } from '../../store/characters.reducer';
import { Observable, Subscription } from 'rxjs';
import { Character } from '../../model/Character';
import { sortedCharacters, characterFilter, columnData, multiSort, tableColumns } from '../../store/characters.selectors';
import { tap, debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { MultiSortSelection } from '../../../core/sort-selection/MultiSortSelection';
import { ColumnDrop } from '../../../core/click-up-table/model/ColumnDrop';
import { CutColumnData } from 'src/app/core/click-up-table/model/ColumnData';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.scss']
})
export class CharacterTableComponent implements OnInit, OnDestroy {
  characters$: Observable<Character[]>;
  sort$: Observable<MultiSortSelection>;
  columnData$: Observable<CutColumnData[]>;
  tableColumns$: Observable<CutColumnData[]>;
  form: FormGroup;
  sink: Subscription[] = [];

  // resizeData$: Subject<{ event: any, i: number }> = new Subject();

  @HostListener('window:resize') onResize() {
    this.store.dispatch(updateTableWidth({ width: window.innerWidth }));
  }

  constructor(private store: Store) {
    this.onResize();
    this.store.dispatch(fetchCharacters());
  }

  ngOnDestroy(): void {
    this.sink.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.characters$ = this.store.select(sortedCharacters);
    this.sort$ = this.store.select(multiSort);
    this.columnData$ = this.store.select(columnData);
    this.tableColumns$ = this.store.select(tableColumns);
    // .pipe(tap(data => console.log('columnData: ', data)));

    this.form = new FormGroup({
      filter: new FormControl('')
    });

    this.sink.push(
      this.form.get('filter')
        .valueChanges
        .pipe(
          debounceTime(300),
          tap(filter => this.store.dispatch(updateFilter({ filter })))
        )
        .subscribe()
    );

    // this is here to repopulate the filter from local storage //
    this.sink.push(
      this.store.select(characterFilter)
        .pipe(
          tap(filter => this.form.patchValue({ filter }))
        )
        .subscribe()
    );

    // this.sink.push(
    //   this.resizeData$
    //     .pipe(
    //       debounceTime(50),
    //       tap(console.log),
    //       tap(data => this.store.dispatch(updateResizerLocation({ index: data.i, deltax: data.event.distance.x })))
    //     )
    //     .subscribe()
    // );
  }

  dropColumn(dropData: ColumnDrop) {
    this.store.dispatch(swapColumns({ drop: dropData }));
  }

  sort(column: string) {
    this.store.dispatch(toggleSort({ column }));
  }

  // resizerMoving(event: any, i: number) {
  //   this.resizeData$.next({ event, i });
  // }

  onResizeColumn(index: number, width: number) {
    // this.store.dispatch(updateColumnWidth({ index, width }));
    console.log('parent: ', index, width);
  }
}
