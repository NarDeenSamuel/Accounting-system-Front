import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {

  /* ================= DATA ================= */
  allProjects: any[] = [];
  projects: any[] = [];
  loading = true;

  /* ================= FILTER ================= */
  searchTerm = '';
  selectedMonth = '';
  months: { label: string; value: string }[] = [];

  /* ================= EDIT PAYMENT ================= */
  editingPaymentId: string | null = null;
  editPaymentForms: { [key: string]: FormGroup } = {};

  /* ================= ADD PAYMENT ================= */
  addPaymentForm!: FormGroup;
  selectedProjectId: string | null = null;

  /* ================= DELETE ================= */
  paymentToDeleteId: string | null = null;

private getCurrentAndPreviousMonths(): string[] {
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');

  const prev = new Date(now);
  prev.setMonth(prev.getMonth() - 1);

  const prevYear = prev.getFullYear();
  const prevMonth = (prev.getMonth() + 1).toString().padStart(2, '0');

  return [
    `${currentYear}-${currentMonth}`,
    `${prevYear}-${prevMonth}`
  ];
}
defaultMonths: string[] = [];

  constructor(
    private paymentsService: PaymentService,
    private fb: FormBuilder
  ) {}

ngOnInit(): void {
  this.buildMonths();
  this.defaultMonths = this.getCurrentAndPreviousMonths(); // ✅ هنا
  this.initAddPaymentForm();
  this.loadData();
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
  loadData(): void {
    this.loading = true;

    this.paymentsService.getAllProjectsWithPayments().subscribe({
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
      p.payments?.forEach((pay: any) => {
        this.editPaymentForms[pay._id] = this.fb.group({
          amount: [pay.amount, Validators.required],
          paymentDate: [pay.paymentDate?.substring(0, 10), Validators.required],
          paymentMethod: [pay.paymentMethod, Validators.required],
          note: [pay.note]
        });
      });
    });
  }

  /* ================= FILTER ================= */
applyFilters(): void {
  this.projects = this.allProjects.filter(p => {

    /* ✅ Active فقط */
    const isActive = p.status === 'active';

    /* 🔍 Search */
    const byName =
      !this.searchTerm ||
      p.title.toLowerCase().includes(this.searchTerm.toLowerCase());

    /* 📅 Month filter */
    let byMonth = true;

    if (this.selectedMonth) {
      // لو المستخدم اختار شهر
      byMonth = p.createdAt?.startsWith(this.selectedMonth);
    } else {
      // الديفولت: الشهر الحالي + السابق
      byMonth = this.defaultMonths.some(m =>
        p.createdAt?.startsWith(m)
      );
    }

    return isActive && byName && byMonth;
  });
}



  /* ================= HELPERS ================= */
  getTotalPaid(p: any): number {
    return p.payments?.reduce((s: number, x: any) => s + x.amount, 0) || 0;
  }

  getRemaining(p: any): number {
    return p.totalAmount - this.getTotalPaid(p);
  }

  /* ================= EDIT ================= */
  startEditPayment(id: string): void {
    this.editingPaymentId = id;
  }

  cancelEditPayment(): void {
    this.editingPaymentId = null;
  }

  updatePayment(pay: any, project: any): void {
    const form = this.editPaymentForms[pay._id];
    if (form.invalid) return;

    const maxAllowed = this.getRemaining(project) + pay.amount;
    if (form.value.amount > maxAllowed) {
      alert('Amount exceeds remaining balance');
      return;
    }

    this.paymentsService.updatePayment(pay._id, form.value)
      .subscribe(() => {
        this.editingPaymentId = null;
        this.loadData();
      });
  }

  /* ================= DELETE ================= */
  openDeleteModal(id: string): void {
    this.paymentToDeleteId = id;
    new (window as any).bootstrap.Modal(
      document.getElementById('deleteModal')
    ).show();
  }

  confirmDelete(): void {
    if (!this.paymentToDeleteId) return;

    this.paymentsService.deletePayment(this.paymentToDeleteId)
      .subscribe(() => {
        this.paymentToDeleteId = null;
        this.loadData();
        (window as any).bootstrap.Modal
          .getInstance(document.getElementById('deleteModal'))
          .hide();
      });
  }

  /* ================= ADD ================= */
  initAddPaymentForm(): void {
    this.addPaymentForm = this.fb.group({
      amount: ['', Validators.required],
      paymentDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      note: ['']
    });
  }

  openAddPaymentModal(projectId: string): void {
    this.selectedProjectId = projectId;
    new (window as any).bootstrap.Modal(
      document.getElementById('addPaymentModal')
    ).show();
  }

submitAddPayment(): void {
  if (this.addPaymentForm.invalid || !this.selectedProjectId) return;

  const payload = {
    ...this.addPaymentForm.value,
    amount: Number(this.addPaymentForm.value.amount), // ✅ هنا
    projecId: this.selectedProjectId
  };

  this.paymentsService.addPayment(payload).subscribe(() => {
    this.addPaymentForm.reset();
    this.loadData();
    (window as any).bootstrap.Modal
      .getInstance(document.getElementById('addPaymentModal'))
      .hide();
  });
}

}
