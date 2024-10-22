import { Injectable } from '@angular/core';
import { ClienteModel } from './cliente.model';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { RespuestaModel } from 'src/app/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService {

  private readonly URL: string = this.CONST.API_URL + '/api/v1/client';

  public obtenerClientes(): Observable<RespuestaModel<ClienteModel[]>> {
    const headers = this.obtenerHeaders();
    
    return this.http.get<any>(this.URL + '/list', { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<ClienteModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAClientes(respuesta.clients);
        return respuestaMapeada;
      }
    ));
  }

  private mapearAClientes(clientes: any[]): ClienteModel[] {
    return clientes.map(
      cliente => {
        return this.mapearACliente(cliente);
      });
  }

  private mapearACliente(cliente: any): ClienteModel {
    return {
      identificacion: cliente.identification,
      nombre: cliente.client_name,
      celular: cliente.client_phone,
    };
  }
}
