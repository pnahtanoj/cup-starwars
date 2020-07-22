import { SortSelection, newSortSelection, progressSelection } from './SortSelection';

export interface MultiSortSelection {
  count: number;
  selections: SortSelection[];
}

/* I would add unit tests and consider refactoring.  A little busy for my taste */
export const toggleSelections = (multi: MultiSortSelection, column: string): MultiSortSelection => {
  const idx = multi.selections.findIndex(s => s.column === column);
  const exist = idx >= 0;
  const isFull = multi.selections.length >= multi.count;

  const updatedSelection = (!exist)
    ? newSortSelection(column)
    : progressSelection(multi.selections[idx]);

  const selections = [...multi.selections];

  if (exist) {
    if (!updatedSelection) {
      selections.splice(idx, 1);
    } else {
      selections[idx] = updatedSelection;
    }
  } else {
    if (isFull) {
      selections.pop();
    }

    selections.push(updatedSelection);
  }

  return {
    ...multi,
    selections
  };
};
