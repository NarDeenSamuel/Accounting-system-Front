import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.css'
})
export class MonthlyReportComponent implements OnInit {

  loading = true;

  /* FILTER */
  months: { label: string; value: string }[] = [];
  selectedMonth = '';

  /* DATA */
  payments: any[] = [];
  expenses: any[] = [];
  salaries: any[] = [];
  pendingProjects: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.buildMonths();

    // ✅ ديفولت الشهر الحالي
    this.selectedMonth = this.getCurrentMonth();

    this.loadReport();
  }

  /* ================= MONTHS ================= */
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

  getCurrentMonth(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${y}-${m}`;
  }

  /* ================= LOAD REPORT ================= */
  loadReport(): void {
    this.loading = true;

    const headers = new HttpHeaders({
      token: localStorage.getItem('token') || ''
    });

    this.http.get<any>(
      `https://accounting-system-rose.vercel.app/dashboard/reports/monthly/details?month=${this.selectedMonth}`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.payments = res.payments || [];
        this.expenses = res.expenses || [];
        this.salaries = res.salaries || [];
        this.pendingProjects = res.pendingProjects || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /* ================= TOTALS ================= */
  getTotalPayments(): number {
    return this.payments.reduce((s, p) => s + p.amount, 0);
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((s, e) => s + e.amount, 0);
  }

  getTotalSalaries(): number {
    return this.salaries.reduce((s, x) => s + x.totalAmount, 0);
  }
getProfit(): number {
  return (
    this.getTotalPayments() -
    this.getTotalExpenses() -
    this.getTotalSalaries()
  );
}

}
