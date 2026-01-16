import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryAddExpensesComponent } from './data-entry-add-expenses.component';

describe('DataEntryAddExpensesComponent', () => {
  let component: DataEntryAddExpensesComponent;
  let fixture: ComponentFixture<DataEntryAddExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryAddExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryAddExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
