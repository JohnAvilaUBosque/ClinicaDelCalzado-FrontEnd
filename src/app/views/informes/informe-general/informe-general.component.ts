import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, ToastModule, ToastComponent, ModalModule, ModalComponent } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OrdenDeTrabajoService } from '../../ordenes-de-trabajo/orden-de-trabajo.service';
import { OrdenDeTrabajoModel } from '../../ordenes-de-trabajo/orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { DiaInformeGeneral } from '../dias-informe-general.model';
import { sum } from 'lodash-es';

@Component({
  selector: 'informe-general',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, FormsModule, ToastModule, ModalModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './informe-general.component.html',
  styleUrl: './informe-general.component.scss'
})
export class InformeGeneralComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public fechaInicial: string = '';
  public fechaFinal: string = '';
  public sonFechasValidas: boolean = false;

  public dias: DiaInformeGeneral[] = [];
  public diasFiltrados: DiaInformeGeneral[] = [];

  public totales: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();

  @ViewChild('elementoADescargar') elementoADescargar!: ElementRef;
  @ViewChild('toastSinResultados') toastSinResultados!: ToastComponent;
  @ViewChild('fechaInicialInvalida') fechaInicialInvalida!: ToastComponent;
  @ViewChild('fechaFinalInvalida') fechaFinalInvalida!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Informe general');

    this.ordenDeTrabajoService.obtenerOrdenes().subscribe(data => {
      data.filter(orden => orden.estadoOrden != this.CONST.ESTADO_ORDEN.ANULADA)
        .map(orden => {
          orden.serviciosRecibidos = orden.servicios.filter(s => s.estado == this.CONST.ESTADO_SERVICIO.RECIBIDO).length;
          orden.serviciosTerminados = orden.servicios.filter(s => s.estado == this.CONST.ESTADO_SERVICIO.TERMINADO).length;
          orden.serviciosDespachados = orden.servicios.filter(s => s.estado == this.CONST.ESTADO_SERVICIO.DESPACHADO).length;
          return orden;
        }).forEach(orden => {
          var fecha = this.CONST.fechaATexto(orden.fechaCreacion, this.CONST.FORMATS_API.DATE);
          var dia = this.dias.find(d => d.fecha == fecha);
          if (dia) {
            dia.precioTotal += orden.precioTotal;
            dia.abono += orden.abono;
            dia.saldo += orden.saldo;
            dia.serviciosRecibidos += orden.serviciosRecibidos;
            dia.serviciosTerminados += orden.serviciosTerminados;
            dia.serviciosDespachados += orden.serviciosDespachados;
          } else {
            dia = new DiaInformeGeneral();
            dia.fecha = fecha;
            dia.precioTotal = orden.precioTotal;
            dia.abono = orden.abono;
            dia.saldo = orden.saldo;
            dia.serviciosRecibidos = orden.serviciosRecibidos;
            dia.serviciosTerminados = orden.serviciosTerminados;
            dia.serviciosDespachados = orden.serviciosDespachados;
            this.dias.push(dia)
          }
        });
      this.dias = this.dias.sort(orden => new Date(orden.fecha).getTime());

      this.route.queryParams.subscribe(
        params => {
          if (!params['fechaInicial'] && !params['fechaFinal']) {
            this.diasFiltrados = [];
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

  irAInformeGeneralConFiltros() {
    this.router.navigate(['informes/general'], { queryParams: { fechaInicial: this.fechaInicial, fechaFinal: this.fechaFinal } });
  }

  irAInformeDetalladoConFiltros(dia: DiaInformeGeneral) {
    this.router.navigate(['informes/detallado'], { queryParams: { fechaInicial: dia.fecha, fechaFinal: dia.fecha } });
  }

  filtrar() {
    var fechaFinalMasUnDia = new Date(this.fechaFinal);
    fechaFinalMasUnDia.setDate(fechaFinalMasUnDia.getDate() + 1);
    this.diasFiltrados = this.dias.filter(
      dia =>
        new Date(this.fechaInicial) <= new Date(dia.fecha)
        && new Date(dia.fecha) < fechaFinalMasUnDia
    );
    if (this.diasFiltrados.length == 0) {
      this.toastSinResultados.visible = true;
    }

    this.totales.precioTotal = sum(this.diasFiltrados.map(orden => orden.precioTotal));
    this.totales.abono = sum(this.diasFiltrados.map(orden => orden.abono));
    this.totales.saldo = sum(this.diasFiltrados.map(orden => orden.saldo));
    this.totales.serviciosRecibidos = sum(this.diasFiltrados.map(orden => orden.serviciosRecibidos));
    this.totales.serviciosTerminados = sum(this.diasFiltrados.map(orden => orden.serviciosTerminados));
    this.totales.serviciosDespachados = sum(this.diasFiltrados.map(orden => orden.serviciosDespachados));
  }

  validarFechas() {
    this.sonFechasValidas = new Date(this.fechaInicial) <= new Date(this.fechaFinal);
  }

  descargar() {
    var nombrePDF = 'Informe-general-'
      + this.CONST.fechaATexto(this.fechaInicial, this.CONST.FORMATS_VIEW.DATE)
      + '-' + this.CONST.fechaATexto(this.fechaFinal, this.CONST.FORMATS_VIEW.DATE);
    this.CONST.descargarPDF(this.elementoADescargar.nativeElement, nombrePDF);
  }
}
