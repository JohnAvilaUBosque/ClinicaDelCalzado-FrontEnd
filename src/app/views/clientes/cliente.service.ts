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

  private mapearAClientes(clientes: any[]): ClienteModel[] {
    return clientes.map(
      cliente => {
        return this.mapearACliente(cliente);
      });
  }

  public mapearACliente(cliente: any): ClienteModel {
    if (!cliente) return new ClienteModel();

    return {
      identificacion: cliente.identification.toString(),
      nombre: cliente.client_name || cliente.name, // TO DO: Pendiente definir cual queda
      celular: cliente.client_phone || cliente.cellphone // TO DO: Pendiente definir cual queda
    };
  }
}