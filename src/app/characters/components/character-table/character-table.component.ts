// https://stackblitz.com/edit/angular-4secmm?file=src%2Fapp%2Fapp.component.ts

import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { fetchCharacters, toggleSort } from '../../store/characters.reducer';
import { Observable } from 'rxjs';
import { Character } from '../../model/Character';
import { characters, sortedCharacters, primarySort, secondarySort } from '../../store/characters.selectors';
import { SortSelection } from '../sort-selection/SortSelection';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.scss']
})
export class CharacterTableComponent implements OnInit {
  characters$: Observable<Character[]>;
  primarySortColumn$: Observable<SortSelection>;
  secondarySortColumn$: Observable<SortSelection>;

  displayedColumns: string[] = ['name', 'birth_year', 'hair_color', 'mass'];
  // columnWidths: number[] = [50, 50, 50, 50];
  // w: string;
  // pressed = false;

  constructor(private store: Store) {
    this.store.dispatch(fetchCharacters());
  }

  ngOnInit(): void {
    this.characters$ = this.store.select(sortedCharacters);
    this.primarySortColumn$ = this.store.select(primarySort);
    this.secondarySortColumn$ = this.store.select(secondarySort);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.item.data === 'resizer') {
      console.log('resizer');
    } else {
      console.log('move!: ', event.previousIndex, event.currentIndex);
      moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }
  }

  sort(column: string) {
    this.store.dispatch(toggleSort({ column }));
  }

  onResizeColumn(event: any, index: number) {
    // this.pressed = true;
    // console.log(event);
    // console.log(!this.pressed);
    // event.preventDefault();
  }
}
