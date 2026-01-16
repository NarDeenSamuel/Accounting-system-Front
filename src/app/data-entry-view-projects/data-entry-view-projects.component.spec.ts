import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryViewProjectsComponent } from './data-entry-view-projects.component';

describe('DataEntryViewProjectsComponent', () => {
  let component: DataEntryViewProjectsComponent;
  let fixture: ComponentFixture<DataEntryViewProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryViewProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryViewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
