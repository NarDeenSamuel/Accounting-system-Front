import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private apiUrl = 'https://accounting-system-rose.vercel.app/projects';

  constructor(private http: HttpClient) {}

  addProject(data: any): Observable<any> {
    const token = localStorage.getItem('token');

    console.log('🔐 TOKEN SENT 👉', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: token || ''   // ✅ الاسم الصح اللي الباك إند مستنيه
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

 getProjectsExpenses(from: string, to: string): Observable<any> {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      token
    });

    return this.http.get(
      `${this.apiUrl}/expenses?from=${from}&to=${to}`,
      { headers }
    );
  }
}
