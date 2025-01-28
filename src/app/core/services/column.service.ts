import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service'; // Asegúrate de que el servicio esté importado

@Injectable({
  providedIn: 'root',
})
export class ColumnService {

  constructor(private localStorageService: LocalStorageService) {}

  // Obtener columnas de productos
  getProductColumns(): string[] {
    const settings = this.localStorageService.getDashboardSettings();
    return settings.productColumns || [];
  }

  // Obtener columnas de compañías
  getCompanyColumns(): string[] {
    const settings = this.localStorageService.getDashboardSettings();
    return settings.companyColumns || [];
  }

  // Guardar columnas de productos en el localStorage
  saveProductColumns(columns: string[]): void {
    const settings = this.localStorageService.getDashboardSettings();
    settings.productColumns = columns;
    this.localStorageService.saveDashboardSettings(settings);
  }

  // Guardar columnas de compañías en el localStorage
  saveCompanyColumns(columns: string[]): void {
    const settings = this.localStorageService.getDashboardSettings();
    settings.companyColumns = columns;
    this.localStorageService.saveDashboardSettings(settings);
  }
}
