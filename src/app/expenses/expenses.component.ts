import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {

  expenses: any[] = [];
  loading = true;

  editingExpenseId: string | null = null;
  editForms: { [key: string]: FormGroup } = {};

  addForm!: FormGroup;
  deleteId: string | null = null;
/* ================= FILTER ================= */
selectedMonth = '';
months: { label: string; value: string }[] = [];
allExpenses: any[] = [];
private getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
}

  constructor(
    private expensesService: ExpenseService,
    private fb: FormBuilder
  ) {}
buildMonths(): void {
  const start = new Date(2025, 0); // Jan 2025
  const now = new Date();

  while (start <= now) {
    const y = start.getFullYear();
    const m = (start.getMonth() + 1).toString().padStart(2, '0');

    this.months.push({
      label: `${y}-${m}`,
      value: `${y}-${m}`
    });

    start.setMonth(start.getMonth() + 1);
  }
}

ngOnInit(): void {
  this.buildMonths();
  this.selectedMonth = this.getCurrentMonth(); // ✅ default الشهر الحالي
  this.loadExpenses();
  this.initAddForm();
}

applyMonthFilter(): void {
  if (!this.selectedMonth) {
    this.expenses = [...this.allExpenses];
    return;
  }

  this.expenses = this.allExpenses.filter(e =>
    e.expenseDate?.startsWith(this.selectedMonth)
  );
}



  /* ================= LOAD ================= */
loadExpenses(): void {
  this.loading = true;

  this.expensesService.getAllExpenses().subscribe({
    next: (res) => {
      this.allExpenses = res.expenses || [];
      this.applyMonthFilter();   // 👈 فلترة هنا
      this.buildEditForms();
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

  buildEditForms(): void {
    this.expenses.forEach(e => {
      this.editForms[e._id] = this.fb.group({
        title: [e.title, Validators.required],
        amount: [e.amount, [Validators.required, Validators.min(1)]],
        expenseDate: [e.expenseDate?.substring(0, 10), Validators.required]
      });
    });
  }

  /* ================= EDIT ================= */
 startEdit(id: string): void {
  this.editingExpenseId = id;
}

cancelEdit(): void {
  this.editingExpenseId = null;
}

  updateExpense(e: any): void {
  const form = this.editForms[e._id];
  if (form.invalid) return;

  this.expensesService.updateExpense(e._id, form.value).subscribe(() => {
    this.editingExpenseId = null;
    this.loadExpenses();
  });
}


  /* ================= DELETE ================= */
  openDeleteModal(id: string): void {
    this.deleteId = id;
    new (window as any).bootstrap.Modal(
      document.getElementById('deleteModal')
    ).show();
  }

  confirmDelete(): void {
    if (!this.deleteId) return;

    this.expensesService.deleteExpense(this.deleteId).subscribe(() => {
      this.deleteId = null;
      this.loadExpenses();
      (window as any).bootstrap.Modal
        .getInstance(document.getElementById('deleteModal'))
        .hide();
    });
  }

  /* ================= ADD ================= */
  initAddForm(): void {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      expenseDate: ['', Validators.required]
    });
  }

  submitAdd(): void {
    if (this.addForm.invalid) return;

    this.expensesService.addExpense(this.addForm.value).subscribe(() => {
      this.addForm.reset();
      this.loadExpenses();
      (window as any).bootstrap.Modal
        .getInstance(document.getElementById('addExpenseModal'))
        .hide();
    });
  }

  /* ================= TOTAL ================= */
 getTotalExpenses(): number {
  return this.expenses.reduce((sum, e) => sum + e.amount, 0);
}

  openAddModal(): void {
  new (window as any).bootstrap.Modal(
    document.getElementById('addExpenseModal')
  ).show();
}

}
