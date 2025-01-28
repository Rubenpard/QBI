import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar el estado de login desde el servicio (ya está sincronizado con localStorage)
    if (!this.authService.getIsLoggedIn()) {
      this.router.navigate(['/forbidden']); // Redirigir si no está autenticado
      return false;
    }

    // Permitir acceso si está autenticado
    return true;
  }
}
