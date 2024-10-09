import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, FormModule } from '@coreui/angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service'
import { OrdenDeTrabajoModel } from '../orden-de-trabajo.model'
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'listado-ordenes',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, FormsModule, FormModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-ordenes.component.html',
  styleUrl: './listado-ordenes.component.scss'
})
export class ListadoOrdenesComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private titleService = inject(Title);
  private router = inject(Router);

  public CONST = inject(ConstantsService);

  public ordenes: OrdenDeTrabajoModel[] = [];

  public filtro: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public ordenesFiltradas: OrdenDeTrabajoModel[] = [];

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Órdenes de trabajo');

    this.ordenDeTrabajoService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data.sort(orden => new Date(orden.fechaCreacion).getTime())
        .reverse();

      this.filtro.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
      this.filtrar();
    })
  }

  filtrar() {
    this.ordenesFiltradas = this.ordenes.filter(x =>
      x.estadoOrden.toLowerCase().includes(this.filtro.estadoOrden.toLowerCase()) &&
      x.numeroOrden.toLowerCase().includes(this.filtro.numeroOrden.toLowerCase()) &&
      x.atendidoPor.toLowerCase().includes(this.filtro.atendidoPor.toLowerCase()) &&
      x.cliente.identificacion.toLowerCase().includes(this.filtro.cliente.identificacion.toLowerCase()) &&
      x.cliente.nombre.toLowerCase().includes(this.filtro.cliente.nombre.toLowerCase()) &&
      x.cliente.celular.toLowerCase().includes(this.filtro.cliente.celular.toLowerCase()) &&
      x.estadoPago.toLowerCase().includes(this.filtro.estadoPago.toLowerCase())
    )
  }

  verOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/' + orden.numeroOrden]);
  }
}
