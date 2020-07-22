import { Character } from './Character';

export interface CharactersResponse {
  count: number;
  next: string;
  previous: string;
  results: Character[];
}
