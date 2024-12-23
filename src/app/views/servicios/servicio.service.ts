import { inject, Injectable } from '@angular/core';
import { ServicioModel } from './servicio.model';
import { catchError, map, Observable } from 'rxjs';
import { OperarioModel } from '../operarios/operario.model';
import { BaseService } from 'src/app/base.service';
import { OperarioService } from '../operarios/operario.service';
import { RespuestaModel } from 'src/app/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService extends BaseService {

  public operarioService = inject(OperarioService);

  private readonly URL_ORDERS: string = this.CONST.API_URL + '/api/v1/work-orders';
  private readonly URL_SERVICE: string = this.CONST.API_URL + '/api/v1/services';

  public obtenerServicios(): Observable<RespuestaModel<ServicioModel[]>> {
    const headers = this.obtenerHeaders();

    return this.http.get<any>(this.URL_SERVICE + '/list', { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<ServicioModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAServicios(respuesta.services);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public obtenerServicio(idServicio: number): Observable<RespuestaModel<ServicioModel>> {
    const headers = this.obtenerHeaders();
    
    return this.http.get<any>(this.URL_SERVICE + '/' + idServicio, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<ServicioModel>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAServicio(respuesta.service);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public editarServicio(servicio: ServicioModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();
    
    var servicioMapeado = this.mapearServicio(servicio);

    return this.http.put<any>(this.URL_ORDERS + '/updated/service/' + servicio.id, servicioMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          servicio: this.mapearAServicio(respuesta.service)
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public mapearServicios(servicios: ServicioModel[]): any[] {
    if (!servicios) return [];

    return servicios.map(
      servicio => {
        return this.mapearServicio(servicio);
      });
  }

  public mapearServicio(servicio: ServicioModel): any {
    if (!servicio) return null;

    return {
      id: servicio.id,
      name: servicio.descripcion.trim(),
      service_name: servicio.descripcion.trim(), // TO DO: Pendiente definir si quitar
      service_status: servicio.estado,
      price: servicio.precioEstablecido ? servicio.precio : null, // Se envía null para que el back no establezca el precio
      has_pending_price: !servicio.precioEstablecido,
      operator_id: servicio.operario.identificacion || null, // TO DO: Pendiente definir si quitar
      operator: servicio.operario.identificacion ? this.operarioService.mapearOperario(servicio.operario) : null
    };
  }

  public mapearAServicios(services: any[]): ServicioModel[] {
    if (!services) return [];

    return services.map(
      service => {
        return this.mapearAServicio(service);;
      });
  }

  public mapearAServicio(service: any): ServicioModel {
    if (!service) return new ServicioModel();

    return {
      id: service.id,
      descripcion: service.name,
      estado: service.service_status,
      precio: service.price,
      precioEstablecido: !service.has_pending_price,
      operario: service.operator?.id_operator ? this.operarioService.mapearAOperario(service.operator) : new OperarioModel()
    };
  }
}