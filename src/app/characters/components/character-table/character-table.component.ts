// https://stackblitz.com/edit/angular-4secmm?file=src%2Fapp%2Fapp.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { fetchCharacters, toggleSort, updateFilter, updateTableWidth, updateResizerLocation, updateColumnWidth, swapColumns } from '../../store/characters.reducer';
import { Observable, Subscription, Subject } from 'rxjs';
import { Character } from '../../model/Character';
import { sortedCharacters, primarySort, secondarySort, characterFilter, columnData, resizerData } from '../../store/characters.selectors';
import { SortSelection } from '../sort-selection/SortSelection';
import { tap, debounceTime, skip, take } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.scss']
})
export class CharacterTableComponent implements OnInit, OnDestroy {
  characters$: Observable<Character[]>;
  primarySortColumn$: Observable<SortSelection>;
  secondarySortColumn$: Observable<SortSelection>;

  columnData$: Observable<{ value: string, width: string }[]>;
  resizerData$: Observable<string[]>;

  form: FormGroup;
  sink: Subscription[] = [];

  resizeData$: Subject<{ event: any, i: number }> = new Subject();

  displayedColumns: string[] = ['name', 'birth_year', 'hair_color', 'mass'];
  columnWidths: string[] = ['25%', '0%', '25%', '50%'];
  // w = '10';
  // pressed = false;

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
    this.primarySortColumn$ = this.store.select(primarySort);
    this.secondarySortColumn$ = this.store.select(secondarySort);
    this.columnData$ = this.store.select(columnData)
      .pipe(tap(data => console.log('columnData: ', data)));
    this.resizerData$ = this.store.select(resizerData)
      .pipe(tap(data => console.log('resizerData: ', data)));

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

    this.sink.push(
      this.resizeData$
        .pipe(
          debounceTime(50),
          tap(console.log),
          tap(data => this.store.dispatch(updateResizerLocation({ index: data.i, deltax: data.event.distance.x })))
        )
        .subscribe()
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    this.store.dispatch(swapColumns({ previous: event.previousIndex, current: event.currentIndex }));
    // console.log(event);
    // if (event.item.data === 'resizer') {
    //   console.log('resizer');
    // } else {
    //   console.log('move!: ', event.previousIndex, event.currentIndex);
    //   moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    // }
  }

  sort(column: string) {
    this.store.dispatch(toggleSort({ column }));
  }

  resizerMoving(event: any, i: number) {
    this.resizeData$.next({ event, i });
  }

  onResizeColumn(index: number, width: number) {
    // this.store.dispatch(updateColumnWidth({ index, width }));
    console.log('parent: ', index, width);
  }
}
