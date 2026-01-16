import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'https://accounting-system-rose.vercel.app/users';

  constructor(private http: HttpClient) {}

  changePassword(data: any): Observable<any> {
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token
    });

    return this.http.post(
      `${this.apiUrl}/changePassword`,
      data,
      { headers }
    );
  }
}
