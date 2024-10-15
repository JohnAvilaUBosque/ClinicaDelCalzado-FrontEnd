import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, FormModule, GridModule, PaginationModule } from '@coreui/angular';
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
  imports: [CommonModule, CardModule, TableModule, GridModule, BadgeModule, ButtonModule, TooltipModule, FormsModule, FormModule, PaginationModule, IconDirective, CurrencyPipe, UpperCasePipe],
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

  public ordenesPorPagina: Array<OrdenDeTrabajoModel[]> = [];
  public paginaActual: number = 1;

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
      (!this.filtro.estadoOrden || x.estadoOrden.toLowerCase() == this.filtro.estadoOrden.toLowerCase()) &&
      x.numeroOrden.toLowerCase().includes(this.filtro.numeroOrden.toLowerCase()) &&
      x.atendidoPor.toLowerCase().includes(this.filtro.atendidoPor.toLowerCase()) &&
      x.cliente.identificacion.toLowerCase().includes(this.filtro.cliente.identificacion.toLowerCase()) &&
      x.cliente.nombre.toLowerCase().includes(this.filtro.cliente.nombre.toLowerCase()) &&
      x.cliente.celular.toLowerCase().includes(this.filtro.cliente.celular.toLowerCase()) &&
      (!this.filtro.estadoPago || x.estadoPago.toLowerCase() == this.filtro.estadoPago.toLowerCase())
    );
    this.paginar();
  }

  paginar() {
    this.paginaActual = 1;
    this.ordenesPorPagina = [];
    for (let i = 0; i < this.ordenesFiltradas.length; i += this.CONST.CANT_FILAS_POR_PAGINA) {
      const ordenes = this.ordenesFiltradas.slice(i, i + this.CONST.CANT_FILAS_POR_PAGINA);
      this.ordenesPorPagina.push(ordenes);
    };
  }

  verOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/' + orden.numeroOrden]);
  }
}
