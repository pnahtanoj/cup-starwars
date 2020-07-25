import { Action, createReducer, on, createAction, props } from '@ngrx/store';
import { CharactersResponse } from '../model/CharactersResponse';
import { Character } from '../model/Character';
import { MultiSortSelection, toggleSelections } from '../components/sort-selection/MultiSortSelection';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ColumnDrop } from 'src/app/core/click-up-table/model/ColumnDrop';
import { CutColumnData } from 'src/app/core/click-up-table/model/ColumnData';

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
  '[Table] Update Resizer Location',
  props<{ index: number, deltax: number }>()
);

export const swapColumns = createAction(
  '[Table] Swap Table Columns',
  props<{ drop: ColumnDrop }>()
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
  tableColumns: CutColumnData[];
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
  tableColumns: [
    {
      property: 'name',
      display: 'Name',
      width: 0
    },
    {
      property: 'birth_year',
      display: 'Birth',
      width: 0
    },
    {
      property: 'hair_color',
      display: 'Hair',
      width: 0
    },
    {
      property: 'eye_color',
      display: 'Eye Color',
      width: 0
    }
  ],

  // Table Data //
  columnTitles: ['Name', 'Birth Year', 'Hair Color', 'Eye Color'],
  columnValues: ['name', 'birth_year', 'hair_color', 'eye_color'],
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
    tableColumns: resetWindowColumnsWidths(width, state.tableColumns),
    columnWidths: resetWindowColumnsWidthsOld(width, state.columnWidths)
  })),
  on(updateColumnWidth, (state, { index, deltax }) => ({
    ...state,
    columnWidths: updateResizers(state.tableWidth, state.columnWidths, index, deltax)
  })),
  on(swapColumns, (state, { drop }) => {
    const columnValues = [...state.columnValues];
    moveItemInArray(columnValues, drop.previous, drop.current);
    const columnWidths = [...state.columnWidths];
    moveItemInArray(columnWidths, drop.previous, drop.current);


    return {
      ...state,
      columnValues,
      columnWidths
    };
  })
);

const resetWindowColumnsWidths = (tableWidth: number, columns: CutColumnData[]): CutColumnData[] => {
  return columns.map(w => ({
    ...w,
    width: tableWidth / 4
  }));
};

const resetWindowColumnsWidthsOld = (tableWidth: number, currentWidths: number[]): number[] => {
  return currentWidths.map(w => tableWidth / 4);
};

// const updateColumnWidths = (widths: number[], index: number, width): number[] => {
//   const returnWidths = [...widths];
//   returnWidths[index] = width;

//   return returnWidths;
// };

const updateResizers = (total: number, widths: number[], index: number, diff: number): number[] => {
  console.log(total, widths, index, diff);

  const leftWidth = Number(widths[index]) + diff;
  const rightWidth = Number(widths[index + 1]) + (-1 * diff);
  const newWidths = [...widths];
  newWidths[index] = leftWidth;
  newWidths[index + 1] = rightWidth;

  return [...newWidths];
};
