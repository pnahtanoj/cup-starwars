import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromCharacters from './characters.reducer';
import { CharactersService } from '../characters.service';
import { characterFilter } from './characters.selectors';

@Injectable()
export class CharactersEffects {
  fetchCharacters = createEffect(() => this.actions$.pipe(
    ofType(fromCharacters.fetchCharacters),
    withLatestFrom(this.store$.select(characterFilter)),
    mergeMap(([action, filter]) => this.data.fetchCharacters({ filter })
      .pipe(
        map(response => fromCharacters.loadCharacters({ response })),
        catchError(() => {
          return EMPTY; // NOT WHAT YOU'D DO IRL
        })
      )
    )
  ));

  updateCharactersQuery$ = createEffect(() => this.actions$.pipe(
    ofType(fromCharacters.updateFilter),
    map(action => fromCharacters.fetchCharacters())
  ));

  constructor(
    private actions$: Actions,
    private store$: Store,
    private data: CharactersService) { }
}
