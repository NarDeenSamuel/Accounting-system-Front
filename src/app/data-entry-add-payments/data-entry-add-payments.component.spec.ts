import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryAddPaymentsComponent } from './data-entry-add-payments.component';

describe('DataEntryAddPaymentsComponent', () => {
  let component: DataEntryAddPaymentsComponent;
  let fixture: ComponentFixture<DataEntryAddPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryAddPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryAddPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
