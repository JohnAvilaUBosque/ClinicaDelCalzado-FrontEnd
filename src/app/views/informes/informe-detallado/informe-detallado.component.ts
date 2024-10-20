import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, ToastModule, ToastComponent, ModalModule, ModalComponent } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { InformesService } from '../informe.service';
import { OrdenDeTrabajoModel } from '../../ordenes-de-trabajo/orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { sum } from 'lodash-es';
import { map } from 'rxjs';

@Component({
  selector: 'informe-detallado',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, FormsModule, ToastModule, ModalModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './informe-detallado.component.html',
  styleUrl: './informe-detallado.component.scss'
})
export class InformeDetalladoComponent implements OnInit {

  private informesService = inject(InformesService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public fechaInicial: string = '';
  public fechaFinal: string = '';
  public sonFechasValidas: boolean = false;

  public ordenes: OrdenDeTrabajoModel[] = [];
  public ordenesFiltradas: OrdenDeTrabajoModel[] = [];

  public totales: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();

  @ViewChild('elementoADescargar') elementoADescargar!: ElementRef;
  @ViewChild('toastSinResultados') toastSinResultados!: ToastComponent;
  @ViewChild('fechaInicialInvalida') fechaInicialInvalida!: ToastComponent;
  @ViewChild('fechaFinalInvalida') fechaFinalInvalida!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Informe detallado');

    this.ordenDeTrabajoService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data.filter(orden => orden.estadoOrden != this.CONST.ESTADO_ORDEN.ANULADA)
        .sort(orden => new Date(orden.fechaCreacion).getTime())
        .map(orden => {
          orden.serviciosRecibidos = orden.servicios.filter(s => s.estado == this.CONST.ESTADO_SERVICIO.RECIBIDO).length;
          orden.serviciosTerminados = orden.servicios.filter(s => s.estado == this.CONST.ESTADO_SERVICIO.TERMINADO).length;
          orden.serviciosDespachados = orden.servicios.filter(s => s.estado == this.CONST.ESTADO_SERVICIO.DESPACHADO).length;
          return orden;
        });

      this.route.queryParams.subscribe(
        params => {
          if (!params['fechaInicial'] && !params['fechaFinal']) {
            this.ordenesFiltradas = [];
            this.fechaInicial = '';
            this.fechaFinal = '';
            return;
          }

          this.fechaInicial = params['fechaInicial'];
          this.fechaFinal = params['fechaFinal'];

          var fechaInicialDate = this.CONST.textoAFecha(this.fechaInicial);
          if (!fechaInicialDate) {
            this.fechaInicialInvalida.visible = true;
            return;
          }

          var fechaFinalDate = this.CONST.textoAFecha(this.fechaFinal);
          if (!fechaFinalDate) {
            this.fechaFinalInvalida.visible = true;
            return;
          }

          this.filtrar();
        }
      );
    })
  }

  irAInformeDetalladoConFiltros() {
    this.router.navigate(['informes/detallado'], { queryParams: { fechaInicial: this.fechaInicial, fechaFinal: this.fechaFinal } });
  }

  irAVerOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/' + orden.numeroOrden]);
  }

  filtrar() {
    var fechaFinalMasUnDia = new Date(this.fechaFinal);
    fechaFinalMasUnDia.setDate(fechaFinalMasUnDia.getDate() + 1);
    this.ordenesFiltradas = this.ordenes.filter(
      orden =>
        new Date(this.fechaInicial) <= new Date(orden.fechaCreacion)
        && new Date(orden.fechaCreacion) < fechaFinalMasUnDia
    );
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

  descargar() {
    var nombrePDF = 'Informe-detallado-'
      + this.CONST.fechaATexto(this.fechaInicial, this.CONST.FORMATS_VIEW.DATE)
      + '-' + this.CONST.fechaATexto(this.fechaFinal, this.CONST.FORMATS_VIEW.DATE);
    this.CONST.descargarPDF(this.elementoADescargar.nativeElement, nombrePDF);
  }
}
