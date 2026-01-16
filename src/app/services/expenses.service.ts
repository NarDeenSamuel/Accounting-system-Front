import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private baseUrl = 'https://accounting-system-rose.vercel.app/expenses';

  constructor(private http: HttpClient) {}

  /* =========================
     GET monthly expenses
  ========================= */
  getMyMonthlyExpenses(month: string): Observable<any> {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      token
    });

    return this.http.get(
      `${this.baseUrl}/my-monthly?month=${month}`,
      { headers }
    );
  }

  /* =========================
     ADD expense
  ========================= */
  addExpense(data: any): Observable<any> {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token
    });

    return this.http.post(this.baseUrl, data, { headers });
  }
}
