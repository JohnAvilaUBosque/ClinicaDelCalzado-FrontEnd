import { inject, Injectable } from '@angular/core';
import { ComentarioModel, OrdenDeTrabajoModel } from './orden-de-trabajo.model';
import { map, Observable } from 'rxjs';
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
    ));
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
    ));
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
          numeroOrden: respuesta.order_Number
        };
        return respuestaMapeada;
      }
    ));
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
          numeroOrden: respuesta.order_Number
        };
        return respuestaMapeada;
      }
    ));
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
    ));
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
    ));
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
    ));
  }

  private mapearOrden(orden: OrdenDeTrabajoModel): any {
    return {
      attended_by: orden.atendidoPor,
      attended_by_id: orden.atendidoPorId,
      create_date: orden.fechaCreacion,
      client: this.mapearCliente(orden.cliente),
      down_payment: orden.abono,
      delivery_date: orden.fechaEntrega,
      services: this.servicioService.mapearServicios(orden.servicios),
      general_comment: orden.comentarios.length > 0 ? orden.comentarios[0].descripcion : '',
    };
  }

  private mapearCliente(cliente: ClienteModel): any {
    return {
      identification: cliente.identificacion,
      name: cliente.nombre,
      cellphone: cliente.celular
    };
  }

  private mapearAOrdenes(ordenes: any[]): OrdenDeTrabajoModel[] {
    return ordenes.map(
      orden => {
        return this.mapearAOrden(orden);
      });
  }

  private mapearAOrden(orden: any): OrdenDeTrabajoModel {
    return {
      numeroOrden: orden.order_number,
      atendidoPorId: orden.attended_by_id,
      atendidoPor: orden.attended_by,
      fechaCreacion: orden.create_date,
      estadoOrden: orden.order_status,
      cliente: this.mapearACliente(orden.client),
      precioTotal: orden.total_value,
      abono: orden.down_payment,
      saldo: orden.balance,
      estadoPago: orden.payment_status,
      fechaEntrega: orden.delivery_date,
      servicios: this.servicioService.mapearAServicios(orden.services),
      cantidadServicios: orden.services_count,
      comentarios: this.mapearAComentarios(orden.comments)
    };
  }

  private mapearACliente(cliente: any): ClienteModel {
    return {
      identificacion: cliente.identification,
      nombre: cliente.name,
      celular: cliente.cellphone
    };
  }

  private mapearAComentarios(comentarios: any[]): ComentarioModel[] {
    return comentarios.map(
      comentario => {
        return {
          id: comentario.id_operator,
          descripcion: comentario.operator_name,
          nombreAdmin: comentario.comment_by,
          fecha: comentario.creation_date,
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