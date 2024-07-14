import { Component, inject } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, TableModule, BadgeComponent } from '@coreui/angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service'
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-listado-ordenes',
  standalone: true,
  imports: [CardComponent, CardBodyComponent, CardHeaderComponent, TableModule, BadgeComponent, CurrencyPipe],
  templateUrl: './listado-ordenes.component.html',
  styleUrl: './listado-ordenes.component.scss'
})
export class ListadoOrdenesComponent {

  private calculatorService = inject(OrdenDeTrabajoService);

  public ordenes: any;

  constructor () {
    this.calculatorService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data['orders'];
    })
  }
}
