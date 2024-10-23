import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { InformeDetalladoModel, InformeGeneralModel } from './informe.model';
import { RespuestaModel } from 'src/app/respuesta.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformesService extends BaseService {

  private readonly URL: string = this.CONST.API_URL + '/api/v1/reports';

  public obtenerInformeDetallado(fechaInicial: string, fechaFinal: string, estadoOrden?: string)
    : Observable<RespuestaModel<InformeDetalladoModel[]>> {
    const headers = this.obtenerHeaders();

    const params = new HttpParams()
    .set('start_date', this.CONST.fechaATexto(fechaInicial, this.CONST.FORMATS_ANGULAR.DATETIME))
    .set('end_date', this.CONST.fechaATexto(fechaFinal, this.CONST.FORMATS_ANGULAR.DATETIME));

    return this.http.post<any>(this.URL + '/detailed', undefined, { params, headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<InformeDetalladoModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAInformeDetallado(respuesta.orders);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public obtenerInformeGeneral(fechaInicial: string, fechaFinal: string, estadoOrden?: string)
    : Observable<RespuestaModel<InformeGeneralModel[]>> {
    const headers = this.obtenerHeaders();

    const params = new HttpParams()
      .set('start_date', this.CONST.fechaATexto(fechaInicial, this.CONST.FORMATS_ANGULAR.DATETIME))
      .set('end_date', this.CONST.fechaATexto(fechaFinal, this.CONST.FORMATS_ANGULAR.DATETIME));

    return this.http.post<any>(this.URL + '/general', undefined, { params, headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<InformeGeneralModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAInformeGeneral(respuesta.orders);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  private mapearAInformeDetallado(ordenes: any[]): InformeDetalladoModel[] {
    return ordenes.map(
      orden => {
        return this.mapearAOrden(orden);
      });
  }

  private mapearAOrden(orden: any): InformeDetalladoModel {
    return {
      estadoOrden: orden.order_status,
      numeroOrden: orden.order_number,
      fechaCreacion: this.CONST.fechaATexto(orden.create_date, this.CONST.FORMATS_ANGULAR.DATE),
      precioTotal: orden.total_value,
      abono: orden.down_payment,
      saldo: orden.balance,
      serviciosRecibidos: orden.services_received,
      serviciosTerminados: orden.services_completed,
      serviciosDespachados: orden.services_dispatched,
    };
  }

  private mapearAInformeGeneral(dias: any[]): InformeGeneralModel[] {
    return dias.map(
      dia => {
        return this.mapearADia(dia);
      });
  }

  private mapearADia(dia: any): InformeGeneralModel {
    return {
      fecha: this.CONST.fechaATexto(dia.create_date, this.CONST.FORMATS_ANGULAR.DATE),
      precioTotal: dia.total_value,
      abono: dia.down_payment,
      saldo: dia.balance,
      // cantOrdenes: dia.cant_ordenes, // TO DO: Pendiente definir si activar
      serviciosRecibidos: dia.services_received,
      serviciosTerminados: dia.services_completed,
      serviciosDespachados: dia.services_dispatched,
    };
  }

}