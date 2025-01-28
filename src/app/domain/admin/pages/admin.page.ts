import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../core/services/localStorage.service';
import { ColumnService } from '../../../core/services/column.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-page',
  imports: [CommonModule],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage implements OnInit {
  allProductColumns: string[] = [];
  allCompanyColumns: string[] = [];
  productColumns: string[] = [];
  companyColumns: string[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private columnService: ColumnService
  ) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns(): void {
    // Cargar productos para extraer las columnas disponibles
    this.localStorageService.getProducts().subscribe((products) => {
      if (products.length > 0) {
        // Suponiendo que el primer producto tiene todas las columnas necesarias
        this.allProductColumns = Object.keys(products[0]); // Extraemos las propiedades del primer producto
        this.productColumns = this.columnService.getProductColumns();
      }
    });

    // Cargar compañías para extraer las columnas disponibles
    this.localStorageService.getCompanies().subscribe((companies) => {
      if (companies.length > 0) {
        // Extraemos las propiedades del primer objeto de compañía
        this.allCompanyColumns = Object.keys(companies[0]);
        this.companyColumns = this.columnService.getCompanyColumns();
      }
    });
  }

  // Cambiar las columnas seleccionadas
  onColumnChange(type: string, column: string, event: any): void {
    if (type === 'product') {
      if (event.target.checked) {
        this.productColumns.push(column);
      } else {
        this.productColumns = this.productColumns.filter(c => c !== column);
      }
      this.columnService.saveProductColumns(this.productColumns);
    } else if (type === 'company') {
      if (event.target.checked) {
        this.companyColumns.push(column);
      } else {
        this.companyColumns = this.companyColumns.filter(c => c !== column);
      }
      this.columnService.saveCompanyColumns(this.companyColumns);
    }
  }
}
