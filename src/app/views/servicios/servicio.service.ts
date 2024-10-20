import { inject, Injectable } from '@angular/core';
import { ServicioModel } from './servicio.model';
import { OrdenDeTrabajoModel } from '../ordenes-de-trabajo/orden-de-trabajo.model';
import { map, Observable } from 'rxjs';
import { OperarioModel } from '../operarios/operario.model';
import { BaseService } from 'src/app/base.service';
import { OperarioService } from '../operarios/operario.service';
import { ErrorModel } from 'src/app/error.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService extends BaseService {

  public operarioService = inject(OperarioService);

  private readonly URL_ORDERS: string = this.CONST.API_URL + '/api/v1/work-orders';
  private readonly URL_SERVICE: string = this.CONST.API_URL + '/api/v1/services';

  public obtenerServicios(): Observable<ErrorModel | ServicioModel[]> {
    return this.http.get<any>(this.URL_SERVICE + '/list').pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAServicios(respuesta.services);
      }
    ));
  }

  public obtenerServicio(idServicio: number): Observable<ErrorModel | ServicioModel> {
    return this.http.get<any>(this.URL_SERVICE + '/' + idServicio).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAServicio(respuesta.service);
      }
    ));
  }

  public editarServicio(servicio: ServicioModel): Observable<ErrorModel | any> {
    var servicioMapeado = this.mapearServicio(servicio);

    return this.http.put<any>(this.URL_ORDERS + '/updated/service/' + servicio.id, servicioMapeado).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message
        };
      }
    ));
  }

  public mapearServicios(servicios: ServicioModel[]): any[] {
    return servicios.map(
      servicio => {
        return this.mapearServicio(servicio);
      });
  }

  public mapearServicio(servicio: ServicioModel): any {
    return {
      id: servicio.id,
      name: servicio.descripcion,
      service_name: servicio.descripcion, // TO DO: Pendiente definir si quitar
      service_status: servicio.estado,
      price: servicio.precio,
      has_pending_price: servicio.precioEstablecido,
      operator_id: servicio.operario.identificacion || null, // TO DO: Pendiente definir si quitar
      operator: servicio.operario.identificacion ? this.operarioService.mapearOperario(servicio.operario) : null
    };
  }

  public mapearAServicios(servicios: any[]): ServicioModel[] {
    return servicios.map(
      servicio => {
        return this.mapearAServicio(servicio);;
      });
  }

  public mapearAServicio(servicio: any): ServicioModel {
    return {
      id: servicio.id,
      descripcion: servicio.name,
      estado: servicio.service_status,
      precio: servicio.price,
      precioEstablecido: servicio.has_pending_price,
      operario: servicio.operator?.id_operator ? this.operarioService.mapearAOperario(servicio.operator) : new OperarioModel()
    };
  }

  private generarComentario(comentario: string, servicio: ServicioModel, o: OrdenDeTrabajoModel, index: number) {
    comentario = 'Se edito el servicio "' + servicio.descripcion + '"';
    if (servicio.operario.nombre != o.servicios[index].operario.nombre)
      comentario += ', se cambió el operador a ' + servicio.operario.nombre;
    if (servicio.precio != o.servicios[index].precio)
      comentario += ', se cambió el precio a ' + servicio.precio;
    if (servicio.estado != o.servicios[index].estado)
      comentario += ', se cambió el estado a "' + servicio.estado;
    return comentario;
  }
}