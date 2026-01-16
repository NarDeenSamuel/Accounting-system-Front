import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'https://accounting-system-rose.vercel.app/projects';
  private paymentsUrl = 'https://accounting-system-rose.vercel.app/payments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ token });
  }

  // 🔹 GET all projects (admin)
  getAllProjects(): Observable<any> {
    return this.http.get(
      `${this.paymentsUrl}/all`,
      { headers: this.getHeaders() }
    );
  }

  // 🔹 UPDATE project
  updateProject(projectId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${projectId}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // 🔹 DELETE project
  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${projectId}`,
      { headers: this.getHeaders() }
    );
  }

  // 🔹 ADD project
  addProject(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}`,
      data,
      { headers: this.getHeaders() }
    );
  }
}
