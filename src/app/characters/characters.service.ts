import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharactersResponse } from './model/CharactersResponse';
import { CharacterQuery } from './model/CharacterQuery';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(private http: HttpClient) { }

  fetchCharacters(query: CharacterQuery): Observable<CharactersResponse> {
    return this.http.get<CharactersResponse>(`https://swapi.dev/api/people/?search=${query.filter}`);
  }
}
