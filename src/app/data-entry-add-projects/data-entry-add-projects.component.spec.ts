import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryAddProjectsComponent } from './data-entry-add-projects.component';

describe('DataEntryAddProjectsComponent', () => {
  let component: DataEntryAddProjectsComponent;
  let fixture: ComponentFixture<DataEntryAddProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryAddProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryAddProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
