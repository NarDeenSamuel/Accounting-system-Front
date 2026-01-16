import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryChangePassComponent } from './data-entry-change-pass.component';

describe('DataEntryChangePassComponent', () => {
  let component: DataEntryChangePassComponent;
  let fixture: ComponentFixture<DataEntryChangePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryChangePassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryChangePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
