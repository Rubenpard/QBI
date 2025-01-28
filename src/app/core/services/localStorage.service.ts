import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(private http: HttpClient) {}

  // Cargar productos desde localStorage o desde la API
  getProducts(): Observable<any[]> {
    const products = this.getFromLocalStorage('products');
    if (products) {
      return of(products); // Retornar los productos guardados en localStorage
    } else {
      return this.http.get<any[]>('https://6787e2bbc4a42c9161089f94.mockapi.io/api/v1/product').pipe(
        tap((data) => this.saveToLocalStorage('products', data))
      );
    }
  }

  // Cargar compañías desde localStorage o desde la API
  getCompanies(): Observable<any[]> {
    const companies = this.getFromLocalStorage('companies');
    if (companies) {
      return of(companies); // Retornar las compañías guardadas en localStorage
    } else {
      return this.http.get<any[]>('https://6787e2bbc4a42c9161089f94.mockapi.io/api/v1/company').pipe(
        tap((data) => this.saveToLocalStorage('companies', data))
      );
    }
  }

  // Función para obtener los datos desde localStorage
  private getFromLocalStorage(key: string): any[] | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Función para guardar datos en localStorage
  private saveToLocalStorage(key: string, data: any[]): void {
    localStorage.setItem(key, JSON.stringify(data)); // Guardamos los datos como string
  }

  // Cargar configuraciones del dashboard desde localStorage
  getDashboardSettings(): any {
    const settings = this.getFromLocalStorage('dashboardSettings');
    return settings ? settings : this.getDefaultSettings(); // Devuelve la configuración por defecto si no existe en localStorage
  }

  // Guardar configuraciones del dashboard en localStorage
  saveDashboardSettings(settings: any): void {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings)); // Guardamos las configuraciones
  }

  // Configuraciones por defecto en caso de que no existan
  private getDefaultSettings() {
    return {
      pagination: 20,
      currency: 'EUR',
      productColumns: ['Name', 'Price'],
      companyColumns: ['Name', 'Location']
    };
  }
}
