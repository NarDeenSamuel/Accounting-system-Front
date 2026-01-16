import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  /* ================= DATA ================= */
  allProjects: any[] = [];
  projects: any[] = [];
  loading = true;

  /* ================= FILTERS ================= */
  searchTerm = '';
  selectedMonth = '';
  months: { label: string; value: string }[] = [];

  /* ================= EDIT ================= */
  editingProjectId: string | null = null;
  editForms: { [key: string]: FormGroup } = {};

  /* ================= ADD ================= */
  showAddForm = false;
  addForm!: FormGroup;
  submitLoading = false;
  submitError = '';
  submitSuccess = false;

  /* ================= DELETE ================= */
  projectToDeleteId: string | null = null;
getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
}

  constructor(
    private projectsService: ProjectService,
    private fb: FormBuilder
  ) {}

 ngOnInit(): void {
  this.buildMonths();

  // ✅ ديفولت الشهر الحالي
  this.selectedMonth = this.getCurrentMonth();

  this.initAddForm();
  this.loadProjects();
}

  /* ================= MONTHS ================= */
  buildMonths(): void {
    const start = new Date(2025, 0);
    const now = new Date();

    while (start <= now) {
      const y = start.getFullYear();
      const m = (start.getMonth() + 1).toString().padStart(2, '0');
      this.months.push({ label: `${y}-${m}`, value: `${y}-${m}` });
      start.setMonth(start.getMonth() + 1);
    }
  }

  /* ================= LOAD ================= */
  loadProjects(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (res) => {
        this.allProjects = res.projects || [];
        this.buildEditForms();
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

 buildEditForms(): void {
  this.allProjects.forEach(p => {
    this.editForms[p._id] = this.fb.group({
      title: [p.title, Validators.required],
      clientName: [p.client?.name, Validators.required],
      clientPhone: [p.client?.phone, Validators.required],
      clientEmail: [p.client?.email, [Validators.required, Validators.email]],
      totalAmount: [p.totalAmount, [Validators.required, Validators.min(1)]],
      expectedPayments: [p.expectedPayments, [Validators.required, Validators.min(1)]],
      startDate: [p.startDate?.substring(0, 10), Validators.required],

      // ✅ الجديد
      status: [p.status, Validators.required]
    });
  });
}


  /* ================= FILTER ================= */
  applyFilters(): void {
    this.projects = this.allProjects.filter(p => {
      const byName =
        !this.searchTerm ||
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      const byMonth =
        !this.selectedMonth ||
        p.createdAt?.startsWith(this.selectedMonth);

      return byName && byMonth;
    });
  }

  /* ================= EDIT ================= */
  startEdit(id: string): void {
    this.editingProjectId = id;
  }

  cancelEdit(): void {
    this.editingProjectId = null;
  }

  updateProject(p: any): void {
    const form = this.editForms[p._id];
    if (form.invalid) return;

    const payload = {
      title: form.value.title,
      client: {
        name: form.value.clientName,
        phone: form.value.clientPhone,
        email: form.value.clientEmail
      },
      totalAmount: form.value.totalAmount,
      expectedPayments: form.value.expectedPayments,
      startDate: form.value.startDate,
      status: form.value.status  // ✅ الجديد
    };

    this.projectsService.updateProject(p._id, payload).subscribe(() => {
      this.editingProjectId = null;
      this.loadProjects();
    });
  }

  /* ================= DELETE ================= */
  openDeleteModal(id: string): void {
    this.projectToDeleteId = id;
    new (window as any).bootstrap.Modal(
      document.getElementById('deleteModal')
    ).show();
  }

  confirmDelete(): void {
    if (!this.projectToDeleteId) return;

    this.projectsService.deleteProject(this.projectToDeleteId).subscribe(() => {
      this.projectToDeleteId = null;
      this.loadProjects();
      (window as any).bootstrap.Modal
        .getInstance(document.getElementById('deleteModal'))
        .hide();
    });
  }

  /* ================= ADD ================= */
  initAddForm(): void {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      clientName: ['', Validators.required],
      clientPhone: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      totalAmount: ['', [Validators.required, Validators.min(1)]],
      expectedPayments: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.submitError = '';
  }

  submitAdd(): void {
    if (this.addForm.invalid) {
      this.submitError = 'Please complete all fields';
      return;
    }

    const v = this.addForm.value;

    const payload = {
      title: v.title,
      client: {
        name: v.clientName,
        phone: v.clientPhone,
        email: v.clientEmail
      },
      totalAmount: v.totalAmount,
      expectedPayments: v.expectedPayments,
      startDate: v.startDate,
      endDate: v.endDate
    };

    this.submitLoading = true;

    this.projectsService.addProject(payload).subscribe(() => {
      this.submitLoading = false;
      this.submitSuccess = true;

      setTimeout(() => {
        this.showAddForm = false;
        this.submitSuccess = false;
        this.addForm.reset();
        this.loadProjects();
      }, 800);
    });
  }

  /* ================= HELPERS ================= */
  getTotalPaid(p: any): number {
    return p.payments?.reduce((s: number, x: any) => s + x.amount, 0) || 0;
  }

  getRemaining(p: any): number {
    return p.totalAmount - this.getTotalPaid(p);
  }


  cancelAdd(): void {
  this.showAddForm = false;
  this.submitLoading = false;
  this.submitSuccess = false;
  this.submitError = '';
  this.addForm.reset();
}

}
