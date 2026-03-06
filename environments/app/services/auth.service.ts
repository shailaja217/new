import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isBrowser: boolean;
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(@Inject(PLATFORM_ID) platformId: Object, private router: Router, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUser();
  }

  private loadUser(): void {
    if (this.isBrowser) {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
        this.isLoggedIn$.next(true);
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            this.isLoggedIn$.next(true);
          }
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedIn$.next(false);
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
} 