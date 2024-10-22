import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, ToastModule, ToastComponent, ModalModule } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InformesService } from '../informe.service';
import { InformeGeneralModel } from '../informe.model';

@Component({
  selector: 'informe-general',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, GridModule, FormModule, FormsModule, ToastModule, ModalModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './informe-general.component.html',
  styleUrl: './informe-general.component.scss'
})
export class InformeGeneralComponent implements OnInit {

  private informesService = inject(InformesService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public fechaInicial: string = '';
  public fechaFinal: string = '';
  public sonFechasValidas: boolean = false;

  public diasFiltrados: InformeGeneralModel[] = [];

  public totales: InformeGeneralModel = new InformeGeneralModel();

  @ViewChild('elementoADescargar') elementoADescargar!: ElementRef;
  @ViewChild('toastSinResultados') toastSinResultados!: ToastComponent;
  @ViewChild('fechaInicialInvalida') fechaInicialInvalida!: ToastComponent;
  @ViewChild('fechaFinalInvalida') fechaFinalInvalida!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Informe general');

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

        this.obtenerInformeGeneral();
      }
    );
  }

  obtenerInformeGeneral() {
    this.CONST.mostrarCargando();

    this.informesService.obtenerInformeGeneral(this.fechaInicial + ' 00:00', this.fechaFinal + ' 23:59').subscribe(
      respuesta => {
        if (respuesta.esError) {
          this.CONST.ocultarCargando();
          this.CONST.mostrarMensajeError(respuesta.error.mensaje);
          return;
        }

        this.diasFiltrados = respuesta.objeto;

        this.CONST.ocultarCargando();

        if (this.diasFiltrados.length == 0)
          this.toastSinResultados.visible = true;
      });
  }

  navegarAInformeGeneral() {
    this.router.navigate(['informes/general'], { queryParams: { fechaInicial: this.fechaInicial, fechaFinal: this.fechaFinal } });
  }

  navegarAInformeDetallado(dia: InformeGeneralModel) {
    this.router.navigate(['informes/detallado'], { queryParams: { fechaInicial: dia.fecha, fechaFinal: dia.fecha } });
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
