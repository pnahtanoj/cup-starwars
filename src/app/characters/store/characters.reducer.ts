import { Action, createReducer, on, createAction, props } from '@ngrx/store';
import { CharactersResponse } from '../model/CharactersResponse';
import { Character } from '../model/Character';
import { MultiSortSelection, toggleSelections } from '../components/sort-selection/MultiSortSelection';

export const stateKey = 'characters';

export const fetchCharacters = createAction(
  '[Characters] Fetch Characters'
);

export const loadCharacters = createAction(
  '[Characters] Load Characters',
  props<{ response: CharactersResponse }>()
);

export const toggleSort = createAction(
  '[Characters] Update Characters Sort',
  props<{ column: string }>()
);

export interface State {
  characters: Character[];
  sort: MultiSortSelection;
}

export const initialState: State = {
  characters: [],
  sort: {
    count: 2,
    selections: [
      { column: 'name', direction: 'ASC' },
      { column: 'hair_color', direction: 'DESC' }
    ]
  }
};


export const reducer = createReducer(
  initialState,
  on(loadCharacters, (state, { response }) => ({
    ...state,
    characters: [...response.results]
  })),
  on(toggleSort, (state, { column }) => ({
    ...state,
    sort: toggleSelections(state.sort, column)
  }))
);

