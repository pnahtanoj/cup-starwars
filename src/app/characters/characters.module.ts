import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCharacters from './store/characters.reducer';

import { CharacterListComponent } from './components/character-table/character-list.component';
import { CharactersEffects } from './store/characters.effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CoreModule } from '../core/core.module';

const routes: Routes = [
  {
    path: '',
    component: CharacterListComponent
  }
];

@NgModule({
  declarations: [
    CharacterListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(fromCharacters.stateKey, fromCharacters.reducer),
    EffectsModule.forFeature([CharactersEffects]),
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class CharactersModule { }

