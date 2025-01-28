import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  

  onLogin() {
    if (this.authService.login(this.username, this.password)) {
      this.isAuthenticated = true; //
      this.errorMessage = ''; // mensaje vacio de error si las claves son correctas
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }

  loginInstructions() {
    this.router.navigate(['/portal/instructions']);
}

loginDashboard(){
    this.router.navigate(['/portal/dashboard']);
}

loginAdmin(){
    this.router.navigate(['/portal/admin']);
}
}