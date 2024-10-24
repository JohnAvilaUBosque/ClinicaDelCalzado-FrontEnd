import { Injectable } from '@angular/core';
import { OperarioModel } from './operario.model';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { RespuestaModel } from 'src/app/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class OperarioService extends BaseService {

  private readonly URL: string = this.CONST.API_URL + '/api/v1/operator';

  public obtenerOperarios(): Observable<RespuestaModel<OperarioModel[]>> {
    const headers = this.obtenerHeaders();

    return this.http.get<any>(this.URL + '/list', { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<OperarioModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAOperarios(respuesta.operators);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public obtenerOperario(idOperario: string): Observable<RespuestaModel<OperarioModel>> {
    const headers = this.obtenerHeaders();

    return this.http.get<any>(this.URL + '/' + idOperario, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<OperarioModel>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAOperario(respuesta.operator);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public crearOperario(operario: OperarioModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var operarioMapeado = this.mapearOperario(operario);

    return this.http.post<any>(this.URL + '/created', operarioMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          operario: this.mapearAOperario(respuesta.operator)
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public editarOperario(operario: OperarioModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var operarioMapeado = this.mapearOperario(operario);

    return this.http.put<any>(this.URL + '/updated/' + operario.identificacion, operarioMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          operario: this.mapearAOperario(respuesta.operator)
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public mapearOperario(operario: OperarioModel): any {
    return {
      id_operator: operario.identificacion,
      operator_name: operario.nombre.trim(),
      ope_phone_number: operario.celular,
      status_operator: operario.estado
    };
  }

  private mapearAOperarios(operators: any[]): OperarioModel[] {
    return operators.map(
      operator => {
        return this.mapearAOperario(operator);
      });
  }

  public mapearAOperario(operator: any): OperarioModel {
    return {
      identificacion: operator.id_operator.toString(),
      nombre: operator.operator_name,
      celular: operator.ope_phone_number,
      estado: operator.status_operator
    };
  }

}
