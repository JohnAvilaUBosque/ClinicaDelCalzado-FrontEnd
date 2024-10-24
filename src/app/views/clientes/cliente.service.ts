import { Injectable } from '@angular/core';
import { ClienteModel } from './cliente.model';
import { catchError, map, Observable } from 'rxjs';
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
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public mapearCliente(cliente: ClienteModel): any {
    if (!cliente) return null;

    return {
      identification: cliente.identificacion,
      name: cliente.nombre.trim(),
      cellphone: cliente.celular
    };
  }

  private mapearAClientes(clients: any[]): ClienteModel[] {
    return clients.map(
      client => {
        return this.mapearACliente(client);
      });
  }

  public mapearACliente(client: any): ClienteModel {
    if (!client) return new ClienteModel();

    return {
      identificacion: client.identification.toString(),
      nombre: client.name,
      celular: client.cellphone
    };
  }
}