import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickUpTableComponent } from './click-up-table/click-up-table.component';
import { SortSelectionComponent } from './sort-selection/sort-selection.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [ClickUpTableComponent, SortSelectionComponent],
  imports: [
    CommonModule,
    CdkTableModule,
    DragDropModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [ClickUpTableComponent, SortSelectionComponent]
})
export class CoreModule { }
