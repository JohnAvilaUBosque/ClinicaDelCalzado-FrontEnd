import { inject, Injectable } from '@angular/core';
import { ComentarioModel, OrdenDeTrabajoModel } from './orden-de-trabajo.model';
import { map, Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { BaseService } from 'src/app/base.service';
import { ClienteModel } from '../clientes/cliente.model';
import { ErrorModel } from 'src/app/error.model';
import { ServicioService } from '../servicios/servicio.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenDeTrabajoService extends BaseService {

  public servicioService = inject(ServicioService);

  private readonly URL: string = this.CONST.API_URL + '/api/v1/work-orders';

  public obtenerOrdenes(): Observable<ErrorModel | OrdenDeTrabajoModel[]> {
    return this.http.get<any>(this.URL + '/list').pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAOrdenes(respuesta.orders);
      }
    ));
  }

  public obtenerOrden(idOrden: string): Observable<ErrorModel | OrdenDeTrabajoModel> {
    return this.http.get<any>(this.URL + '/' + idOrden).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAOrden(respuesta);
      }
    ));
  }

  public crearOrden(orden: OrdenDeTrabajoModel): Observable<ErrorModel | any> {
    var ordenMapeada = this.mapearOrden(orden);

    return this.http.post<any>(this.URL + '/created', ordenMapeada).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message,
          numeroOrden: respuesta.order_Number
        };
      }
    ));
  }

  public migrarOrden(orden: OrdenDeTrabajoModel): Observable<ErrorModel | any> {
    var ordenMapeada = this.mapearOrden(orden);

    return this.http.post<any>(this.URL + '/created', ordenMapeada).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message,
          numeroOrden: respuesta.order_Number
        };
      }
    ));
  }

  public anularOrden(numeroOrden: number): Observable<ErrorModel | any> {
    return this.http.put<any>(this.URL + '/cancel/' + numeroOrden, null).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message
        };
      }
    ));
  }

  public abonarAOrden(numeroOrden: number, abono: number): Observable<ErrorModel | any> {
    var objeto = { "payment_amount": abono };

    return this.http.put<any>(this.URL + '/payment/' + numeroOrden, objeto).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message
        };
      }
    ));
  }

  public comentarOrden(numeroOrden: number, comentario: number): Observable<ErrorModel | any> {
    var objeto = { "comment": comentario };

    return this.http.put<any>(this.URL + '/comment/' + numeroOrden, objeto).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message
        };
      }
    ));
  }

  private mapearOrden(orden: OrdenDeTrabajoModel): any {
    return {
      attended_by: orden.atendidoPor,
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

  private mapearComentario(comentario: ComentarioModel): any {
    return {
      id_operator: comentario.id,
      operator_name: comentario.descripcion,
      x: comentario.nombreAdmin, // TO DO: Pendiente definir
      y: comentario.fecha, // TO DO: Pendiente definir
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
          nombreAdmin: comentario.x, // TO DO: Pendiente definir
          fecha: comentario.y, // TO DO: Pendiente definir
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