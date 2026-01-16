import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalaryService } from '../services/salary.service';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.css'
})
export class SalariesComponent implements OnInit {

  salaries: any[] = [];
  filteredSalaries: any[] = [];
  loading = true;

  /* FILTER */
  months: { label: string; value: string }[] = [];
  selectedMonth = '';

  /* EDIT */
  editingId: string | null = null;
  editForms: { [key: string]: FormGroup } = {};

  /* ADD */
  addForm!: FormGroup;

  /* DELETE */
  deleteId: string | null = null;


  constructor(
    private salaryService: SalaryService,
    private fb: FormBuilder
  ) {}

ngOnInit(): void {
  this.buildMonths();
  this.selectedMonth = this.getCurrentMonth();
  this.initAddForm();
  this.loadSalaries();
}

private getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
}


  /* MONTHS */
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

  /* LOAD */
  loadSalaries(): void {
    this.loading = true;
    this.salaryService.getAll().subscribe({
      next: (res) => {
        this.salaries = res.salaries || [];
        this.buildEditForms();
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  buildEditForms(): void {
    this.salaries.forEach(s => {
      this.editForms[s._id] = this.fb.group({
        title: [s.title, Validators.required],
        totalAmount: [s.totalAmount, [Validators.required, Validators.min(1)]]
      });
    });
  }

  /* FILTER */
  applyFilters(): void {
    this.filteredSalaries = this.salaries.filter(s =>
      !this.selectedMonth || s.month === this.selectedMonth
    );
  }

  /* EDIT */
  startEdit(id: string): void {
    this.editingId = id;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  updateSalary(s: any): void {
    const form = this.editForms[s._id];
    if (form.invalid) return;

    this.salaryService.update(s._id, form.value).subscribe(() => {
      this.editingId = null;
      this.loadSalaries();
    });
  }

  /* DELETE */
  openDeleteModal(id: string): void {
    this.deleteId = id;
    new (window as any).bootstrap.Modal(
      document.getElementById('deleteModal')
    ).show();
  }

  confirmDelete(): void {
    if (!this.deleteId) return;

    this.salaryService.delete(this.deleteId).subscribe(() => {
      this.deleteId = null;
      this.loadSalaries();
      (window as any).bootstrap.Modal
        .getInstance(document.getElementById('deleteModal'))
        .hide();
    });
  }

  /* ADD */
  initAddForm(): void {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(1)]],
      month: ['', Validators.required]
    });
  }

  openAddModal(): void {
    new (window as any).bootstrap.Modal(
      document.getElementById('addSalaryModal')
    ).show();
  }

  submitAdd(): void {
    if (this.addForm.invalid) return;

    this.salaryService.add(this.addForm.value).subscribe(() => {
      this.addForm.reset();
      this.loadSalaries();
      (window as any).bootstrap.Modal
        .getInstance(document.getElementById('addSalaryModal'))
        .hide();
    });
  }

  /* TOTAL */
  getTotal(): number {
    return this.filteredSalaries.reduce((s, x) => s + x.totalAmount, 0);
  }
}
