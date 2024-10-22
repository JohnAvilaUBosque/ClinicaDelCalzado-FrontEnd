import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
      .set('start_date', fechaInicial)
      .set('end_date', fechaFinal);

    return this.http.post<any>(this.URL + '/detailed', null, { params, headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<InformeDetalladoModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAInformeDetallado(respuesta.orders);
        return respuestaMapeada;
      }
    ));
  }

  public obtenerInformeGeneral(fechaInicial: string, fechaFinal: string, estadoOrden?: string)
    : Observable<RespuestaModel<InformeGeneralModel[]>> {
    const headers = this.obtenerHeaders();

    const params = new HttpParams()
      .set('start_date', fechaInicial)
      .set('end_date', fechaFinal);

    return this.http.post<any>(this.URL + '/general', null, { params, headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<InformeGeneralModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAInformeGeneral(respuesta.orders);
        return respuestaMapeada;
      }
    ));
  }

  private mapearAInformeDetallado(ordenes: any[]): InformeDetalladoModel[] {
    return ordenes.map(
      orden => {
        return this.mapearAOrden(orden);
      });
  }

  private mapearAOrden(orden: any): InformeDetalladoModel {
    return {
      // estadoOrden: orden.order_status, // TO DO: Pendiente definir si activar
      estadoOrden: orden.services_received == 0 && orden.services_completed == 0 && orden.balance == 0
        ? this.CONST.ESTADO_ORDEN.FINALIZADA : this.CONST.ESTADO_ORDEN.VIGENTE, // TO DO: Pendiente definir si quitar
      numeroOrden: orden.order_number,
      fechaCreacion: orden.create_date,
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
      fecha: dia.creation_date,
      precioTotal: dia.total_value,
      abono: dia.down_payment,
      saldo: dia.balance,
      serviciosRecibidos: dia.services_received,
      serviciosTerminados: dia.services_completed,
      serviciosDespachados: dia.services_dispatched,
    };
  }

}