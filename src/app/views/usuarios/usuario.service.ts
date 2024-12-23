import { Injectable } from '@angular/core';
import { DatosSeguridadModel, RecuperacionModel, UsuarioModel } from './usuario.model';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { RespuestaModel } from 'src/app/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService {

  private readonly URL: string = this.CONST.API_URL + '/api/v1/auth';

  public iniciarSesion(usuario: UsuarioModel): Observable<RespuestaModel<any>> {
    var usuarioMapeado = this.mapearUsuario(usuario);

    return this.http.post<any>(this.URL + '/login', usuarioMapeado).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          token: respuesta.access_token,
          tipoToken: respuesta.token_type,
          esClaveTemporal: respuesta.has_temporary_password
        };

        this.cambiarToken(respuestaMapeada.objeto.token);

        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public recuperarClave(recuperacion: RecuperacionModel): Observable<RespuestaModel<any>> {
    var recuperacionMapeada = this.mapearRecuperacion(recuperacion);

    return this.http.post<any>(this.URL + '/password-recovery', recuperacionMapeada).pipe(map(
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

  private mapearUsuario(usuario: UsuarioModel): any {
    return {
      identification: usuario.identificacion,
      password: usuario.clave
    };
  }

  private mapearRecuperacion(recuperacion: RecuperacionModel): any {
    return {
      identification: recuperacion.identificacion,
      answers_security: this.mapearDatosSeguridad(recuperacion.datosSeguridad),
      new_password: recuperacion.claveNueva,
      confirm_new_password: recuperacion.claveConfirmacion
    };
  }

  public mapearDatosSeguridad(datosSeguridad: DatosSeguridadModel): any {
    return [
      {
        id_question: datosSeguridad.pregunta1,
        answer: datosSeguridad.respuesta1.trim()
      },
      {
        id_question: datosSeguridad.pregunta2,
        answer: datosSeguridad.respuesta2.trim()
      },
      {
        id_question: datosSeguridad.pregunta3,
        answer: datosSeguridad.respuesta3.trim()
      }
    ];
  }

}