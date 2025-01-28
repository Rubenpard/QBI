import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LocalStorageService } from '../../../core/services/localStorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ArcElement, Tooltip, Legend, Title, DoughnutController } from 'chart.js';
import { CapitalizePipe } from '../../../core/pipe/capitalize.pipe';
import { ColumnService } from '../../../core/services/column.service';

@Component({
  selector: 'dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, AfterViewInit {
  selectedType: string = 'product'; // Por defecto 'product'
  products: any[] = [];
  companies: any[] = [];
  productColumns: string[] = [];
  companyColumns: string[] = [];
  columnNames: string[] = [];
  companyColumnNames: string[] = [];
  totalValue: number = 0;
  isAdmin: boolean = true; // O puedes utilizar un valor real de la sesión de usuario
  doughnutChart: Chart | undefined; // Guardar el gráfico para manipularlo después

  @ViewChild('doughnutCanvas') doughnutCanvasRef: ElementRef<HTMLCanvasElement> | undefined;
  private counterInterval: any;

  constructor(private localStorageService: LocalStorageService, private columnService: ColumnService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Acceder al canvas después de que la vista haya sido completamente inicializada
    this.updateDoughnutChart();
  }

  loadData(): void {
    if (this.selectedType === 'product') {
      this.localStorageService.getProducts().subscribe((data) => {
        this.products = data;
        this.columnNames = this.columnService.getProductColumns();
        if (this.products.length > 0) {
          this.columnNames = Object.keys(this.products[0]);
        }
        this.updateCounter();
        this.updateDoughnutChart();
      });
    }else if (this.selectedType === 'company'){
      this.localStorageService.getCompanies().subscribe((data) => {
        this.companies = data;
        this.companyColumnNames = this.columnService.getCompanyColumns();
        if(this.companies.length > 0){
          this.companyColumnNames = Object.keys(this.companies[0]);
        }
        this.updateCounter();
        this.updateDoughnutChart();
      })
    }
    const settings = this.localStorageService.getDashboardSettings();
    this.productColumns = settings.productColumns;
    this.companyColumns = settings.companyColumns;

    // Cargar los productos y compañías
    this.localStorageService.getProducts().subscribe((products) => {
      this.products = products;
    });

    this.localStorageService.getCompanies().subscribe((companies) => {
      this.companies = companies;
    });
  }

    // Función para obtener solo las columnas visibles de un producto o compañía
    getVisibleColumns(type: string): string[] {
      return type === 'product' ? this.productColumns : this.companyColumns;
    }



  updateCounter(): void {
    const targetValue =
      this.selectedType === 'product'
        ? this.products.reduce((sum, product) => {
            const price = parseFloat(product.price);
            return sum + (isNaN(price) ? 0 : price);
          }, 0)
        : this.companies.length;
  
    const increment = Math.ceil(targetValue / 100); // Determina el incremento para la animación
    let currentValue = 0;
  
    // Borra cualquier intervalo previo
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  
    this.counterInterval = setInterval(() => {
      if (currentValue < targetValue) {
        currentValue = Math.min(currentValue + increment, targetValue); // Evita superar el valor objetivo
        this.totalValue = currentValue;
      } else {
        clearInterval(this.counterInterval); // Detén el intervalo al alcanzar el objetivo
      }
    }, 10); // Incrementos cada 10ms
  }

  // Método para obtener las columnas dinámicas de la tabla
  getTableColumns(type: string): string[] {
    const data = type === 'product' ? this.products : this.companies;
    return data.length > 0 ? Object.keys(data[0]) : [];
  }

  // Actualizar el gráfico Doughnut
  updateDoughnutChart(): void {
    const canvas = this.doughnutCanvasRef?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Destruir el gráfico anterior si existe
        if (this.doughnutChart) {
          this.doughnutChart.destroy();
        }

        let data: any;

        if (this.selectedType === 'product') {
          // Agrupar productos en rangos de precio
          const ranges = {
            '0-150': 0,
            '150-300': 0,
            '300-500': 0,
            '500+': 0
          };

          this.products.forEach((product) => {
            const price = parseFloat(product.price); // Asegúrate de convertir el precio
            if (price <= 150) ranges['0-150']++;
            else if (price <= 300) ranges['150-300']++;
            else if (price <= 500) ranges['300-500']++;
            else ranges['500+']++;
          });

          data = {
            labels: ['0€ - 150€', '150€ - 300€', '300€ - 500€', '+500€'],
            datasets: [{
              data: Object.values(ranges),
              backgroundColor: ['#FF9999', '#FF6666', '#FF3333', '#FF0000'],
              hoverBackgroundColor: ['#FFAAAA', '#FF7777', '#FF4444', '#FF2222']
            }]
          };
        } else if (this.selectedType === 'company') {
          // Agrupar compañías por 'suffix'
          const suffixes: any = {};
          this.companies.forEach((company) => {
            const suffix = company.name.split(' ').pop();
            if (suffix) {
              suffixes[suffix] = (suffixes[suffix] || 0) + 1;
            }
          });

          data = {
            labels: Object.keys(suffixes),
            datasets: [{
              data: Object.values(suffixes),
              backgroundColor: ['#66FF66', '#66CC66', '#339933', '#006600'],
              hoverBackgroundColor: ['#88FF88', '#88CC88', '#66AA66', '#44BB44']
            }]
          };
        }

        // Configuración de la gráfica
        Chart.register(
          DoughnutController,
          ArcElement,
          Tooltip,
          Legend,
          Title
        );

        this.doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return tooltipItem.raw + ' items';
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  onChangeDataType(event: any): void {
    this.selectedType = event.target.value;
    this.loadData(); // Cargar datos nuevamente y actualizar la gráfica
  }
}
