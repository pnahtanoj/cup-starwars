import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickUpTableComponent } from './click-up-table.component';

describe('ClickUpTableComponent', () => {
  let component: ClickUpTableComponent;
  let fixture: ComponentFixture<ClickUpTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickUpTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickUpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
