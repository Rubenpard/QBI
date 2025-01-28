import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Proveer HttpClient
import { AppComponent } from './app/app.component'; // Mantener AppComponent
import { appConfig } from './app/app.config'; // Mantener appConfig
import { DashboardPage } from './app/domain/dashboard/pages/dashboard.page'; // Importar DashboardPage

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    ...(appConfig.providers || [])
  ]
}).catch((err) => console.error(err));
