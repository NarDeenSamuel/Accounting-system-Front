import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private baseUrl = 'https://accounting-system-rose.vercel.app/expenses';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      token: token   // ✅ مهم جدًا
    });
  }

  // GET all expenses
  getAllExpenses(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}`,
      { headers: this.getHeaders() }
    );
  }

  // ADD expense
  addExpense(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // UPDATE expense
  updateExpense(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // DELETE expense
  deleteExpense(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
