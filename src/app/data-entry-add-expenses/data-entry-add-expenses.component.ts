import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-data-entry-add-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './data-entry-add-expenses.component.html',
  styleUrl: './data-entry-add-expenses.component.css'
})
export class DataEntryAddExpensesComponent implements OnInit {

  expenses: any[] = [];
  loading = true;

  showForm = false;
  expenseForm!: FormGroup;

  submitError = '';
  submitLoading = false;

  constructor(
    private expensesService: ExpensesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadExpenses();
  }

  /* =========================
     Init Form
  ========================= */
  initForm(): void {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      expenseDate: ['', Validators.required]
    });
  }

  /* =========================
     Load current month expenses
  ========================= */
 totalAmount = 0;

loadExpenses(): void {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  this.loading = true; // 👈 مهم

  this.expensesService.getMyMonthlyExpenses(month).subscribe({
    next: (res) => {
      this.expenses = res.expenses || [];

      // حساب الإجمالي
      this.totalAmount = this.expenses.reduce(
        (sum: number, e: any) => sum + Number(e.amount),
        0
      );

      this.loading = false; // ✅ هنا
    },
    error: () => {
      this.loading = false; // ✅ وهنا
    }
  });
}


  /* =========================
     Toggle form
  ========================= */
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.submitError = '';
  }

  /* =========================
     Submit expense
  ========================= */
 submit(): void {
  this.submitError = '';

  if (this.expenseForm.invalid) {
    this.expenseForm.markAllAsTouched();

    // رسالة موحدة
    this.submitError = 'Please fill all fields correctly';
    return;
  }

  const amount = Number(this.expenseForm.value.amount);

  if (amount <= 0) {
    this.submitError = 'Amount must be greater than 0';
    return;
  }

  this.submitLoading = true;

  const payload = this.expenseForm.value;

  this.expensesService.addExpense(payload).subscribe({
    next: () => {
      this.submitLoading = false;
      this.showForm = false;
      this.expenseForm.reset();
      this.loadExpenses();
    },
    error: (err) => {
      this.submitLoading = false;
      this.submitError = err?.error?.message || 'Failed to add expense';
    }
  });
}


}
