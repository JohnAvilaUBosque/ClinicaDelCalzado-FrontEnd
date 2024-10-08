import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, ToastModule, ToastComponent } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OrdenDeTrabajoService } from '../../ordenes-de-trabajo/orden-de-trabajo.service';
import { OrdenDeTrabajoModel } from '../../ordenes-de-trabajo/orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { sum } from 'lodash-es';
import { map } from 'rxjs';

@Component({
  selector: 'informe-detallado',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, FormsModule, ToastModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './informe-detallado.component.html',
  styleUrl: './informe-detallado.component.scss'
})
export class InformeDetalladoComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public constService = inject(ConstantsService);

  public fechaInicial: string = '';
  public fechaFinal: string = '';
  public sonFechasValidas: boolean = false;

  public ordenes: OrdenDeTrabajoModel[] = [];
  public ordenesFiltradas: OrdenDeTrabajoModel[] = [];

  public totales: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();

  @ViewChild('toastSinResultados') toastSinResultados!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + 'Informe detallado');

    this.ordenDeTrabajoService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data.filter(orden => orden.estadoOrden != this.constService.ESTADO_ORDEN.ANULADA)
        .sort(orden => new Date(orden.fechaCreacion).getTime())
        .map(orden => {
          orden.serviciosRecibidos = orden.servicios.filter(s => s.estado == this.constService.ESTADO_SERVICIO.RECIBIDO).length;
          orden.serviciosTerminados = orden.servicios.filter(s => s.estado == this.constService.ESTADO_SERVICIO.TERMINADO).length;
          orden.serviciosDespachados = orden.servicios.filter(s => s.estado == this.constService.ESTADO_SERVICIO.DESPACHADO).length;
          return orden;
        });

      this.route.queryParams.subscribe(
        params => {
          if (params['fechaInicial']) this.fechaInicial = params['fechaInicial'];
          if (params['fechaFinal']) this.fechaFinal = params['fechaFinal'];
          if (params['fechaInicial'] || params['fechaFinal']) this.filtrar();
        }
      );
    })
  }

  verOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/' + orden.numeroOrden]);
  }

  filtrar() {
    var fechaFinalMasUnDia = new Date(this.fechaFinal);
    fechaFinalMasUnDia.setDate(new Date(this.fechaFinal).getDate() + 1);
    this.ordenesFiltradas = this.ordenes.filter(orden => new Date(this.fechaInicial) < new Date(orden.fechaCreacion) && new Date(orden.fechaCreacion) < fechaFinalMasUnDia);
    if (this.ordenesFiltradas.length == 0) {
      this.toastSinResultados.visible = true;
    }

    this.totales.precioTotal = sum(this.ordenesFiltradas.map(orden => orden.precioTotal));
    this.totales.abono = sum(this.ordenesFiltradas.map(orden => orden.abono));
    this.totales.saldo = sum(this.ordenesFiltradas.map(orden => orden.saldo));
    this.totales.serviciosRecibidos = sum(this.ordenesFiltradas.map(orden => orden.serviciosRecibidos));
    this.totales.serviciosTerminados = sum(this.ordenesFiltradas.map(orden => orden.serviciosTerminados));
    this.totales.serviciosDespachados = sum(this.ordenesFiltradas.map(orden => orden.serviciosDespachados));
  }

  validarFechas() {
    this.sonFechasValidas = new Date(this.fechaInicial) <= new Date(this.fechaFinal);
  }

}
