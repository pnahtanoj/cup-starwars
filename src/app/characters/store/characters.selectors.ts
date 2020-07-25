import { createSelector } from '@ngrx/store';
import { charactersFeature } from './index';
import { SortSelection } from '../components/sort-selection/SortSelection';
import { Character } from '../model/Character';

const MAGIC_NUMBER_RESIZER_WIDTH = 3;

export const characters = createSelector(charactersFeature, state => state.characters);
export const characterFilter = createSelector(charactersFeature, state => state.filter);
export const primarySort = createSelector(charactersFeature, state => state.sort.selections[0] || undefined);
export const secondarySort = createSelector(charactersFeature, state => state.sort.selections[1] || undefined);
export const columnValues = createSelector(charactersFeature, state => state.columnValues);
export const columnWidths = createSelector(charactersFeature, state => state.columnWidths);
export const columnData = createSelector(columnValues, columnWidths, (values, widths) => values.map((value, i) => ({
  value,
  width: `${widths[i]}px`
})));
export const resizerData = createSelector(columnWidths, widths =>
  widths
    .slice(0, 3)
    .map((width, i) => widths
      .reduce((acc, item, j) => (j <= i) ? ((acc + item) - MAGIC_NUMBER_RESIZER_WIDTH) : acc, 0) // not very efficient
    )
    .map(width => `${width}px`)
);

export const sortedCharacters = createSelector(characters, primarySort, secondarySort, (unsorted, primary, secondary) => {
  // duplicate - would ordinarily use some kind of deep copy (ramda, lodash) //
  const sorted = [...unsorted];

  sorted.sort(twoTierSort(primary, secondary));

  return sorted;
});

/*
  HELPERS

  This is prime unit-test/refactor territory.  Seems to work.
  It could be made recursive to support n-depth, but I wouldn't head that far w/o unit testing
*/
const twoTierSort = (primarySortSelection: SortSelection, secondarySortSelection: SortSelection) =>
  (a, b) => {
    // No Sorting To Be Done
    if (!primarySortSelection) {
      return 1;
    }

    const primarySortValue = sortCharacter(a, b, primarySortSelection);

    return (primarySortValue === 0 && !!secondarySortSelection)
      ? sortCharacter(a, b, secondarySortSelection)
      : primarySortValue;
  };

// ONLY HANDLING STRINGS //
const sortCharacter = (a: Character, b: Character, sort: SortSelection): number => {
  if (a[sort.column] < b[sort.column]) {
    return (sort.direction === 'ASC') ? -1 : 1;
  } else if (a[sort.column] > b[sort.column]) {
    return (sort.direction === 'ASC') ? 1 : -1;
  } else {
    return 0;
  }
};
