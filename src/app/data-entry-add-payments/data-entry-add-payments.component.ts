import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-data-entry-add-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './data-entry-add-payments.component.html',
  styleUrl: './data-entry-add-payments.component.css'
})
export class DataEntryAddPaymentsComponent implements OnInit {

  projects: any[] = [];
  loading = true;
submitSuccess: { [key: string]: boolean } = {};
submitErrors: { [key: string]: string } = {};
submitLoading: { [key: string]: boolean } = {};

  forms: { [key: string]: FormGroup } = {};

  constructor(
    private paymentsService: PaymentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadData();

localStorage.getItem('token')
console.log('Token:', localStorage.getItem('token'));
  }

  /* ===============================
     Load current + previous month
  =============================== */
  loadData(): void {
    const now = new Date();

    const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1);
    const from = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

    this.paymentsService.getProjectsExpenses(from, to).subscribe({
      next: (res) => {
        this.projects = res.projects?.active || [];

        this.projects.forEach((p: any) => {
          this.forms[p.projectId] = this.fb.group({
            amount: ['', [Validators.required, Validators.min(1)]],
            paymentDate: ['', Validators.required],
            paymentMethod: ['cash', Validators.required],
            note: ['']
          });
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  /* ===============================
     Submit payment
  =============================== */
submit(project: any) {
  const projectId = project.projectId;
  this.submitLoading[projectId] = true;
  this.submitErrors[projectId] = '';
  this.submitSuccess[projectId] = false;

  const data = {
    projecId: projectId,
    ...this.forms[projectId].value
  };

  this.paymentsService.addPayment(data).subscribe({
    next: (res: any) => {

      // ✅ تحديث الأرقام
      project.totalPaid = res.totalPaid;
      project.remainingAmount = res.remainingAmount;

      // ✅ إضافة الدفعة الجديدة
      project.payments.push(res.payment);

      // ✅ إظهار رسالة النجاح
      this.submitSuccess[projectId] = true;

      // ⏱️ تخفي الرسالة بعد 3 ثواني
      setTimeout(() => {
        this.submitSuccess[projectId] = false;
      }, 3000);

      // ✅ Reset الفورم
      this.forms[projectId].reset();

      this.submitLoading[projectId] = false;
    },
    error: (err) => {
      this.submitErrors[projectId] =
        err.error?.message || 'Something went wrong';
      this.submitLoading[projectId] = false;
    }
  });
}



}
