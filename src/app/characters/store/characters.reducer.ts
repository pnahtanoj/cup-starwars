import { createReducer, on, createAction, props } from '@ngrx/store';
import { CharactersResponse } from '../model/CharactersResponse';
import { Character } from '../model/Character';
import { ColumnData } from '@/core/click-up-table/model/ColumnData';
import { toggleSelections, MultiSortSelection } from '@/core/sort-selection/model/MultiSortSelection';

export const stateKey = 'characters';

export const fetchCharacters = createAction(
  '[Characters] Fetch Characters'
);

export const loadCharacters = createAction(
  '[Characters] Load Characters',
  props<{ response: CharactersResponse }>()
);

export const updateFilter = createAction(
  '[Characters] Update Filter',
  props<{ filter: string }>()
);

export const toggleSort = createAction(
  '[Characters] Update Characters Sort',
  props<{ column: string }>()
);

export const updateTableWidth = createAction(
  '[Table] Update Table Width',
  props<{ width: number }>()
);

export const updateColumns = createAction(
  '[Table] Update Column Values',
  props<{ columns: ColumnData[] }>()
);

export const updateColumnWidth = createAction(
  '[Table] Update Column Width',
  props<{ index: number, deltax: number }>()
);

export interface State {
  characters: Character[];
  filter: string;
  sort: MultiSortSelection;

  // Table Data //
  tableWidth: number;
  tableColumns: ColumnData[];
}

export const getInitialState = (): State => ({
  characters: [],
  filter: '',
  sort: {
    count: 2,
    selections: [
      { column: 'name', direction: 'ASC' },
      { column: 'hair_color', direction: 'DESC' }
    ]
  },
  // Table Data //
  tableWidth: 0,
  tableColumns: [
    { property: 'name', display: 'Name', width: 0 },
    { property: 'birth_year', display: 'Birth Year', width: 0 },
    { property: 'hair_color', display: 'Hair', width: 0 },
    { property: 'eye_color', display: 'Eye Color', width: 0 }
  ]
});

export const reducer = createReducer(
  getInitialState(),
  on(loadCharacters, (state, { response }) => ({
    ...state,
    characters: [...response.results]
  })),
  on(updateFilter, (state, { filter }) => ({
    ...state,
    filter
  })),
  on(toggleSort, (state, { column }) => ({
    ...state,
    sort: toggleSelections(state.sort, column)
  })),
  on(updateTableWidth, (state, { width }) => ({
    ...state,
    tableWidth: width,
    tableColumns: resetWindowColumnsWidths(width, state.tableColumns),
  })),
  on(updateColumns, (state, { columns }) => ({
    ...state,
    tableColumns: columns
  })),
);

const resetWindowColumnsWidths = (tableWidth: number, columns: ColumnData[]): ColumnData[] => {
  return columns.map(w => ({
    ...w,
    width: tableWidth / 4
  }));
};
