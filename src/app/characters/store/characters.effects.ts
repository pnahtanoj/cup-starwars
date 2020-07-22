import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromCharacters from './characters.reducer';
import { CharactersService } from '../characters.service';

@Injectable()
export class CharactersEffects {
  fetchCharacters = createEffect(() => this.actions$.pipe(
    ofType(fromCharacters.fetchCharacters),
    mergeMap(payload => this.data.fetchCharacters()
      .pipe(
        map(response => fromCharacters.loadCharacters({ response })),
        catchError(() => {
          return EMPTY;
        })
      )
    )
  )
  );

  constructor(private actions$: Actions, private data: CharactersService) { }
}
