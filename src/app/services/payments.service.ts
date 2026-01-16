import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private paymentsUrl = 'https://accounting-system-rose.vercel.app/payments/';
  private projectsUrl = 'https://accounting-system-rose.vercel.app/projects';

  constructor(private http: HttpClient) {}

  /* ===========================
     GET projects with payments
     =========================== */
  getProjectsExpenses(from: string, to: string): Observable<any> {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      token
    });

    return this.http.get(
      `${this.projectsUrl}/expenses?from=${from}&to=${to}`,
      { headers }
    );
  }

  /* ===========================
     ADD payment
     =========================== */
  addPayment(data: any) {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token
    });

    return this.http.post(this.paymentsUrl, data, { headers });
  }
}
