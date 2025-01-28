import { Routes } from '@angular/router';
import { InstructionsPage } from './domain/instructions/pages/instructions.page';
import { LoginPage } from './domain/login/pages/login.page';
import { PortalPage } from './domain/portal/pages/portal.page';
import { DashboardPage } from './domain/dashboard/pages/dashboard.page';
import { AdminPage } from './domain/admin/pages/admin.page';
import { ForbiddenPage } from './domain/forbidden/pages/forbidden.component';
import { NotFoundPage } from './domain/not-found/pages/not-found.page';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'portal',
    component: PortalPage,
    canActivate: [AuthGuard],
    children: [
      { path: 'instructions', component: InstructionsPage },
      { path: 'dashboard', component: DashboardPage },
      { path: 'admin', component: AdminPage },
    ],
  },
  { path: 'login', component: LoginPage },
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'not-found', component: NotFoundPage },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' }, // Redirigir rutas inexistentes
];
