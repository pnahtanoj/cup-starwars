import { Action, createReducer, on, createAction, props } from '@ngrx/store';
import { CharactersResponse } from '../model/CharactersResponse';
import { Character } from '../model/Character';
import { MultiSortSelection, toggleSelections } from '../components/sort-selection/MultiSortSelection';
import { moveItemInArray } from '@angular/cdk/drag-drop';

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

export const updateColumnWidth = createAction(
  '[Table] Update Table Column Width',
  props<{ index: number, width: number }>()
);

export const updateResizerLocation = createAction(
  '[Table] Update Resizer Location',
  props<{ index: number, deltax: number }>()
);

export const swapColumns = createAction(
  '[Table] Swap Table Columns',
  props<{ previous: number, current: number }>()
);


export interface State {
  characters: Character[];
  filter: string;
  sort: MultiSortSelection;
  // Table Data //
  columnTitles: string[];
  columnValues: string[];
  columnWidths: number[];
  tableWidth: number;
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
  columnTitles: ['Name', 'Birth Year', 'Hair Color', 'Mass'],
  columnValues: ['name', 'birth_year', 'hair_color', 'mass'],
  columnWidths: [0, 0, 0, 0],
  tableWidth: 0
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
    columnWidths: resetWindowColumnsWidths(width, state.columnWidths)
  })),
  // on(updateColumnWidth, (state, { index, width }) => ({
  //   ...state,
  //   columnWidths: updateColumnWidths(state.columnWidths, index, width)
  // })),
  on(updateResizerLocation, (state, { index, deltax }) => ({
    ...state,
    columnWidths: updateResizers(state.tableWidth, state.columnWidths, index, deltax)
  })),
  on(swapColumns, (state, { previous, current }) => {
    const columnValues = [...state.columnValues];
    moveItemInArray(columnValues, previous, current);
    const columnWidths = [...state.columnWidths];
    moveItemInArray(columnWidths, previous, current);


    return {
      ...state,
      columnValues,
      columnWidths
    };
  })
);

const resetWindowColumnsWidths = (tableWidth: number, currentWidths: number[]): number[] => {
  return currentWidths.map(w => tableWidth / 4);
};

// const updateColumnWidths = (widths: number[], index: number, width): number[] => {
//   const returnWidths = [...widths];
//   returnWidths[index] = width;

//   return returnWidths;
// };

const updateResizers = (total: number, widths: number[], index: number, diff: number): number[] => {
  console.log(total, widths, index, diff);
  // const percentageDiff = diff / totalWidth;

  const leftWidth = widths[index] + diff;
  const rightWidth = widths[index + 1] + (-1 * diff);
  const newWidths = [...widths];
  newWidths[index] = leftWidth;
  newWidths[index + 1] = rightWidth;

  // console.log(percentageDiff, newWidths);


  return [...newWidths];
};
