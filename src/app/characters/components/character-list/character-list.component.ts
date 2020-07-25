import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { fetchCharacters, updateFilter, updateTableWidth, updateColumns, toggleSort } from '../../store/characters.reducer';
import { Observable, Subscription } from 'rxjs';
import { Character } from '../../model/Character';
import { sortedCharacters, characterFilter, multiSort, tableColumns } from '../../store/characters.selectors';
import { tap, debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { MultiSortSelection } from '@/core/components/sort-selection/model/MultiSortSelection';
import { ColumnData } from '@/core/components/click-up-table/model/ColumnData';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  characters$: Observable<Character[]>;
  sort$: Observable<MultiSortSelection>;
  tableColumns$: Observable<ColumnData[]>;
  form: FormGroup;
  sink: Subscription[] = [];

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
    this.tableColumns$ = this.store.select(tableColumns);

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

  }

  updateColumns(columns: ColumnData[]) {
    this.store.dispatch(updateColumns({ columns }));
  }

  sort(column: string) {
    this.store.dispatch(toggleSort({ column }));
  }
}
