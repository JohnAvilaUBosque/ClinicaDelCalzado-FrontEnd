import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, ToastModule, ToastComponent, ModalModule } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { InformesService } from '../informe.service';
import { FormsModule } from '@angular/forms';
import { InformeDetalladoModel } from '../informe.model';

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

  public ordenesFiltradas: InformeDetalladoModel[] = [];

  public totales: InformeDetalladoModel = new InformeDetalladoModel();

  @ViewChild('elementoADescargar') elementoADescargar!: ElementRef;
  @ViewChild('toastSinResultados') toastSinResultados!: ToastComponent;
  @ViewChild('fechaInicialInvalida') fechaInicialInvalida!: ToastComponent;
  @ViewChild('fechaFinalInvalida') fechaFinalInvalida!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Informe detallado');

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

        this.obtenerInformeDetallado();
      }
    );
  }

  obtenerInformeDetallado() {
    this.CONST.mostrarCargando();

    this.informesService.obtenerInformeDetallado(this.fechaInicial + ' 00:00', this.fechaFinal + ' 23:59').subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.ordenesFiltradas = respuesta.objeto;
        this.CONST.ocultarCargando();

        if (this.ordenesFiltradas.length == 0)
          this.toastSinResultados.visible = true;
      });
  }

  navegarAInformeDetallado() {
    this.router.navigate(['informes/detallado'], { queryParams: { fechaInicial: this.fechaInicial, fechaFinal: this.fechaFinal } });
  }

  navegarAVerOrden(numeroOrden: string) {
    this.router.navigate(['ordenesdetrabajo/ver/' + numeroOrden]);
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
