import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCharacters from './store/characters.reducer';

import { CharacterTableComponent } from './components/character-table/character-table.component';
import { CharactersEffects } from './store/characters.effects';
import { SortSelectionComponent } from './components/sort-selection/sort-selection.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResizeDirective } from '../resize.directive';

const routes: Routes = [
  {
    path: '',
    component: CharacterTableComponent
  }
];

@NgModule({
  declarations: [
    CharacterTableComponent,
    SortSelectionComponent,
    ResizeDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(fromCharacters.stateKey, fromCharacters.reducer),
    EffectsModule.forFeature([CharactersEffects]),
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CdkTableModule,
    DragDropModule
  ]
})
export class CharactersModule { }

