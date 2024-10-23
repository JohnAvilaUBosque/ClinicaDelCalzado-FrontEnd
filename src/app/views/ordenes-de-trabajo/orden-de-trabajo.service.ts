import { inject, Injectable } from '@angular/core';
import { ComentarioModel, OrdenDeTrabajoModel } from './orden-de-trabajo.model';
import { catchError, map, Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { BaseService } from 'src/app/base.service';
import { ClienteModel } from '../clientes/cliente.model';
import { ServicioService } from '../servicios/servicio.service';
import { RespuestaModel } from 'src/app/respuesta.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdenDeTrabajoService extends BaseService {

  public servicioService = inject(ServicioService);

  private readonly URL: string = this.CONST.API_URL + '/api/v1/work-orders';

  public obtenerOrdenes(estadoOrden: string): Observable<RespuestaModel<OrdenDeTrabajoModel[]>> {
    const headers = this.obtenerHeaders();

    const params = new HttpParams()
      .set('order_status', estadoOrden);

    return this.http.get<any>(this.URL + '/list', { params, headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<OrdenDeTrabajoModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAOrdenes(respuesta.orders);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public obtenerOrden(idOrden: string): Observable<RespuestaModel<OrdenDeTrabajoModel>> {
    const headers = this.obtenerHeaders();

    return this.http.get<any>(this.URL + '/' + idOrden, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<OrdenDeTrabajoModel>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAOrden(respuesta);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public crearOrden(orden: OrdenDeTrabajoModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var ordenMapeada = this.mapearOrden(orden);

    return this.http.post<any>(this.URL + '/created', ordenMapeada, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          numeroOrden: respuesta.order_number
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public migrarOrden(orden: OrdenDeTrabajoModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var ordenMapeada = this.mapearOrden(orden);

    return this.http.post<any>(this.URL + '/created', ordenMapeada, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          numeroOrden: respuesta.order_number
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public abonarAOrden(numeroOrden: string, abono: number): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var objeto = { "payment_amount": abono };

    return this.http.put<any>(this.URL + '/payment/' + numeroOrden, objeto, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public comentarOrden(numeroOrden: string, comentario: string): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var objeto = { "comment": comentario };

    return this.http.put<any>(this.URL + '/comment/' + numeroOrden, objeto, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public anularOrden(numeroOrden: string, comentario: string): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var objeto = { "comment": comentario };

    return this.http.put<any>(this.URL + '/cancel/' + numeroOrden, objeto, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  private mapearOrden(orden: OrdenDeTrabajoModel): any {
    if (!orden) return null;

    return {
      attended_by: orden.atendidoPor,
      attended_by_id: orden.atendidoPorId,
      create_date: this.CONST.fechaATexto(orden.fechaCreacion, this.CONST.FORMATS_API.DATETIME),
      client: this.mapearCliente(orden.cliente),
      down_payment: orden.abono,
      delivery_date: this.CONST.fechaATexto(orden.fechaEntrega, this.CONST.FORMATS_API.DATE),
      services: this.servicioService.mapearServicios(orden.servicios),
      general_comment: orden.comentarios.length > 0 ? orden.comentarios[0].descripcion : '',
    };
  }

  private mapearCliente(cliente: ClienteModel): any {
    if (!cliente) return null;

    return {
      identification: cliente.identificacion,
      name: cliente.nombre,
      cellphone: cliente.celular
    };
  }

  private mapearAOrdenes(ordenes: any[]): OrdenDeTrabajoModel[] {
    if (!ordenes) return [];

    return ordenes.map(
      orden => {
        return this.mapearAOrden(orden);
      });
  }

  private mapearAOrden(orden: any): OrdenDeTrabajoModel {
    if (!orden) return new OrdenDeTrabajoModel();

    return {
      numeroOrden: orden.order_number,
      atendidoPorId: orden.attended_by_id,
      atendidoPor: orden.attended_by || '',
      fechaCreacion: this.CONST.fechaATexto(orden.create_date, this.CONST.FORMATS_ANGULAR.DATETIME),
      estadoOrden: orden.order_status,
      cliente: this.mapearACliente(orden.client),
      precioTotal: orden.total_value,
      abono: orden.down_payment,
      saldo: orden.balance,
      estadoPago: orden.payment_status,
      fechaEntrega: this.CONST.fechaATexto(orden.delivery_date, this.CONST.FORMATS_ANGULAR.DATE),
      servicios: this.servicioService.mapearAServicios(orden.services),
      cantidadServicios: orden.services_count,
      comentarios: this.mapearAComentarios(orden.comments)
    };
  }

  private mapearACliente(cliente: any): ClienteModel {
    if (!cliente) return new ClienteModel();

    return {
      identificacion: cliente.identification.toString(),
      nombre: cliente.name,
      celular: cliente.cellphone
    };
  }

  private mapearAComentarios(comentarios: any[]): ComentarioModel[] {
    if (!comentarios) return [];

    return comentarios.map(
      comentario => {
        return {
          id: comentario.id_comment,
          descripcion: comentario.comment,
          nombreAdmin: comentario.comment_by,
          fecha: this.CONST.fechaATexto(comentario.creation_date, this.CONST.FORMATS_ANGULAR.DATE),
        };
      });
  }

  private obtenerSiguienteNumero(ordenes: OrdenDeTrabajoModel[], fechaCreacion: string) {
    var ultimaOrden = ordenes.sort(orden => new Date(orden.fechaCreacion).getTime()).pop();
    var siguienteNumero: string = '';
    if (ultimaOrden) {
      var ultimoNumero = ultimaOrden.numeroOrden.substring(13);
      var numero = parseInt(ultimoNumero) + 1;
      siguienteNumero = numero.toString().padStart(5, '0');
    }
    return 'ORD-' + formatDate(fechaCreacion, 'yyyyMMdd', 'en-US') + '-' + siguienteNumero || '00001';
  }
}