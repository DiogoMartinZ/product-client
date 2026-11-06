import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7143/api/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; passwordHash: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response && response.success) {
          // Guarda um indicador de que o utilizador está autenticado
          localStorage.setItem('isLoggedIn', 'true');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}