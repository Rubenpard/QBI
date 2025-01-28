import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'portal-page',
    templateUrl: './portal.page.html',
    styleUrls: ['./portal.page.scss'],
    imports: [RouterOutlet, RouterLink, CommonModule]
})
export class PortalPage implements OnInit {
    isLoggedIn = false;
    userRole: 'Guest' | 'User' | 'Admin' | null = null;
  
    constructor(private authService: AuthService) {}
  
    ngOnInit(): void {
      // Suscribirse al estado de autenticación y rol
      this.isLoggedIn = this.authService.getIsLoggedIn();
      this.userRole = this.authService.getUserRole();
    }
  }