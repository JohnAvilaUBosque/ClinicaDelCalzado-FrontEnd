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

    return this.http.get<any>(this.URL + '/detailed', { params, headers }).pipe(map(
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

    return this.http.get<any>(this.URL + '/general', { params, headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<InformeGeneralModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAInformeGeneral(respuesta.orders);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  private mapearAInformeDetallado(orders: any[]): InformeDetalladoModel[] {
    return orders.map(
      order => {
        return this.mapearAOrden(order);
      });
  }

  private mapearAOrden(order: any): InformeDetalladoModel {
    return {
      estadoOrden: order.order_status,
      numeroOrden: order.order_number,
      fechaCreacion: this.CONST.fechaATexto(order.creation_date, this.CONST.FORMATS_ANGULAR.DATE),
      precioTotal: order.total_services_value,
      abono: order.total_deposits,
      saldo: order.total_balance,
      serviciosRecibidos: order.services_received,
      serviciosTerminados: order.services_completed,
      serviciosDespachados: order.services_dispatched,
    };
  }

  private mapearAInformeGeneral(days: any[]): InformeGeneralModel[] {
    return days.map(
      day => {
        return this.mapearADia(day);
      });
  }

  private mapearADia(day: any): InformeGeneralModel {
    return {
      fecha: this.CONST.fechaATexto(day.creation_date, this.CONST.FORMATS_ANGULAR.DATE),
      precioTotal: day.total_services_value,
      abono: day.total_deposits,
      saldo: day.total_balance,
      // cantOrdenes: dia.cant_ordenes, // TO DO: Pendiente definir si activar
      serviciosRecibidos: day.services_received,
      serviciosTerminados: day.services_completed,
      serviciosDespachados: day.services_dispatched,
      
    };
  }

}