import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.getInitialLoginState());
  private userRole: 'Guest' | 'User' | 'Admin' | null = this.getInitialUserRole();

  private validUsers = [
    { username: 'guest', password: 'guest123', role: 'Guest' },
    { username: 'user', password: 'user123', role: 'User' },
    { username: 'admin', password: 'admin123', role: 'Admin' },
  ];

  login(username: string, password: string): boolean {
    const user = this.validUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.isLoggedIn.next(true);
      this.userRole = user.role as 'Guest' | 'User' | 'Admin';
      // Guardar el estado en localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', this.userRole);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.next(false);
    this.userRole = null;
    // Limpiar el estado de localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn.getValue();
  }

  getUserRole(): 'Guest' | 'User' | 'Admin' | null {
    return this.userRole;
  }

  isLoggedIn$ = this.isLoggedIn.asObservable();

  // Métodos privados para recuperar el estado inicial
  private getInitialLoginState(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  private getInitialUserRole(): 'Guest' | 'User' | 'Admin' | null {
    return (localStorage.getItem('userRole') as 'Guest' | 'User' | 'Admin' | null) || null;
  }
}
