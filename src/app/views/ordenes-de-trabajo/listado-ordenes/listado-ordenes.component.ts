import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, FormModule, GridModule, PaginationModule, ToastComponent, ToastModule } from '@coreui/angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service'
import { OrdenDeTrabajoModel } from '../orden-de-trabajo.model'
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'listado-ordenes',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, GridModule, BadgeModule, ButtonModule, TooltipModule, FormsModule, FormModule, PaginationModule, ToastModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-ordenes.component.html',
  styleUrl: './listado-ordenes.component.scss'
})
export class ListadoOrdenesComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public ordenes: OrdenDeTrabajoModel[] = [];

  public filtro: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public ordenesFiltradas: OrdenDeTrabajoModel[] = [];

  public ordenesPorPagina: Array<OrdenDeTrabajoModel[]> = [];
  public paginaActual: number = 1;

  @ViewChild('estadoOrdenInvalido') estadoOrdenInvalido!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Órdenes de trabajo');

    this.route.queryParams.subscribe(
      params => {
        if (!params['estadoOrden']) {
          this.filtro.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
          this.ordenesFiltradas = [];
          this.obtenerOrdenes();
          return;
        }

        var filtroEstadoOrden = (params['estadoOrden'] as string).toUpperCase();
        if (this.CONST.validarValorEnumerador(filtroEstadoOrden, this.CONST.ESTADO_ORDEN)) {
          this.filtro.estadoOrden = filtroEstadoOrden;
        } else {
          this.estadoOrdenInvalido.visible = true;
          this.filtro.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
        }

        this.obtenerOrdenes();
      }
    );
  }

  obtenerOrdenes() {
    this.CONST.mostrarCargando();

    this.ordenDeTrabajoService.obtenerOrdenes(this.filtro.estadoOrden).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.ordenes = respuesta.objeto;
        this.filtrar();
        this.CONST.ocultarCargando();
      });
  }

  navegarAListado() {
    this.router.navigate(['ordenesdetrabajo/listado'], { queryParams: { estadoOrden: this.filtro.estadoOrden } });
  }

  filtrar() {
    this.ordenesFiltradas = this.ordenes.filter(x =>
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

  navegarAVerOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/' + orden.numeroOrden]);
  }
}
