import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-data-entry-add-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './data-entry-add-projects.component.html',
  styleUrl: './data-entry-add-projects.component.css'
})
export class DataEntryAddProjectsComponent {

  projectForm: FormGroup;
  errorMessage = '';
  showSuccess = false; // 👈 للتحكم في علامة الصح

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],

      client: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),

      totalAmount: ['', Validators.required],
      expectedPayments: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.projectForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      this.projectForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    this.projectsService.addProject(this.projectForm.value).subscribe({
      next: () => {
        // ✨ عرض علامة الصح
        this.showSuccess = true;

        // ⏱ بعد 1.5 ثانية
        setTimeout(() => {
          this.showSuccess = false;
          this.projectForm.reset(); // 🧹 تفريغ الفورم
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Failed to save project';
      }
    });
  }
}
