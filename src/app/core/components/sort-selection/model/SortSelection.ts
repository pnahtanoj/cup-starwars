export type SortDirection = 'ASC' | 'DESC';
export interface SortSelection {
  column: string;
  direction: SortDirection;
}

export const newSortSelection = (column: string): SortSelection => ({ column, direction: 'ASC' });
export const progressSelection = (selection: SortSelection): SortSelection => (selection.direction === 'ASC')
  ? { ...selection, direction: 'DESC' }
  : undefined;
