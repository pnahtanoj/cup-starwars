import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharactersResponse } from './model/CharactersResponse';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(private http: HttpClient) { }

  fetchCharacters(): Observable<CharactersResponse> {
    return this.http.get<CharactersResponse>('https://swapi.dev/api/people/');
  }
}
