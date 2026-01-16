import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentsUrl = 'https://accounting-system-rose.vercel.app/payments';

  constructor(private http: HttpClient) {}

  /* نفس الهيدر المستخدم في ProjectService */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ token });
  }

  /* ================= GET ================= */
  getAllProjectsWithPayments(): Observable<any> {
    return this.http.get(
      `${this.paymentsUrl}/all`,
      { headers: this.getHeaders() }
    );
  }

  /* ================= ADD ================= */
  addPayment(data: any): Observable<any> {
    return this.http.post(
      `${this.paymentsUrl}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /* ================= UPDATE ================= */
  updatePayment(paymentId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.paymentsUrl}/${paymentId}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /* ================= DELETE ================= */
  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete(
      `${this.paymentsUrl}/${paymentId}`,
      { headers: this.getHeaders() }
    );
  }
}
