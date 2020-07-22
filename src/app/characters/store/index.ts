import { createFeatureSelector } from '@ngrx/store';
import * as fromCharacters from './characters.reducer';

// need to match module //
export interface State {
  [fromCharacters.stateKey]: fromCharacters.State;
}

export const charactersFeature = createFeatureSelector<State, fromCharacters.State>(fromCharacters.stateKey);
