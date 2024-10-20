import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { InformeDetalladoModel } from './informe.model';
import { ErrorModel } from 'src/app/error.model';
import { ServicioService } from '../servicios/servicio.service';

@Injectable({
  providedIn: 'root'
})
export class InformesService extends BaseService {

  public servicioService = inject(ServicioService);

  private readonly URL: string = this.CONST.API_URL + '/api/v1/reports';

  public obtenerInformeDetallado(fechaInicial: string, fechaFinal: string, estadoOrden?: string)
    : Observable<ErrorModel | InformeDetalladoModel[]> {
    var objeto = {
      start_date: fechaInicial,
      end_date: fechaFinal,
      order_status: estadoOrden
    };

    return this.http.post<any>(this.URL + '/detailed', objeto).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAInformeDetallado(respuesta.orders);
      }
    ));
  }

  public obtenerInformeGeneral(fechaInicial: string, fechaFinal: string, estadoOrden?: string)
    : Observable<ErrorModel | InformeDetalladoModel[]> {
    var objeto = {
      start_date: fechaInicial,
      end_date: fechaFinal,
      order_status: estadoOrden
    };

    return this.http.post<any>(this.URL + '/detailed', objeto).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAInformeDetallado(respuesta.orders);
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
}