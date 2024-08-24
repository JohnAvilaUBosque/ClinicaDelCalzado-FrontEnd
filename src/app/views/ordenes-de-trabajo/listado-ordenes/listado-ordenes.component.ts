import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule } from '@coreui/angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service'
import { OrdenDeTrabajoModel } from '../orden-de-trabajo.model'
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service'
import { Router } from '@angular/router';

@Component({
  selector: 'listado-ordenes',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-ordenes.component.html',
  styleUrl: './listado-ordenes.component.scss'
})
export class ListadoOrdenesComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private router = inject(Router);

  public constantsService = inject(ConstantsService);

  public ordenes: OrdenDeTrabajoModel[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.ordenDeTrabajoService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data;
    })
  }

  verOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/'+orden.orderNumber]); // TO DO: Hacer esto dentro del suscribe del crear orden
  }
}
