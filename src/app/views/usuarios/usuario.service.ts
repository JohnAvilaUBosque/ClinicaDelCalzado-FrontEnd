import { Injectable } from '@angular/core';
import { AdministradorModel } from '../admins/administrador.model';
import { DatosSeguridadModel, RecuperacionModel, UsuarioModel } from './usuario.model';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { ErrorModel } from 'src/app/error.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService {

  private readonly localStorageKeyUser: string = 'U';
  private readonly localStorageKeyToken: string = 'T';

  private readonly URL: string = this.CONST.API_URL + '/api/v1/auth';

  public iniciarSesion(usuario: UsuarioModel): Observable<ErrorModel | any> {
    var usuarioMapeado = this.mapearUsuario(usuario);

    return this.http.post<any>(this.URL + '/login', usuarioMapeado).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message,
          token: respuesta.access_token,
          tipoToken: respuesta.token_type,
          esClaveTemporal: respuesta.has_temporary_password
        };
      }
    ));
  }

  public recuperarClave(recuperacion: RecuperacionModel): Observable<ErrorModel | any> {
    var recuperacionMapeada = this.mapearRecuperacion(recuperacion);

    return this.http.post<any>(this.URL + '/password-recovery', recuperacionMapeada).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message
        };
      }
    ));
  }

  public cerrarSesion() {
    this.borrarAdminLocal();
    this.borrarToken();
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

  private mapearDatosSeguridad(datosSeguridad: DatosSeguridadModel): any {
    return [
      {
        id_question: datosSeguridad.pregunta1,
        answer: datosSeguridad.respuesta1
      },
      {
        id_question: datosSeguridad.pregunta2,
        answer: datosSeguridad.respuesta2
      },
      {
        id_question: datosSeguridad.pregunta3,
        answer: datosSeguridad.respuesta3
      }
    ];
  }

  public cambiarAdminLocal(admin: AdministradorModel) {
    var adminJson = admin ? JSON.stringify(admin) : '';
    localStorage.setItem(this.localStorageKeyUser, this.CONST.encriptarTexto(adminJson) ?? '')
  }

  public obtenerAdminLocal(): AdministradorModel {
    var adminJson = this.CONST.desencriptarTexto(localStorage.getItem(this.localStorageKeyUser));
    return adminJson ? JSON.parse(adminJson ?? '') : null;
  }

  public borrarAdminLocal() {
    localStorage.removeItem(this.localStorageKeyUser);
  }

  public cambiarToken(token: string) {
    localStorage.setItem(this.localStorageKeyToken, this.CONST.encriptarTexto(token) ?? "")
  }

  public obtenerToken(): string | null {
    var token = this.CONST.desencriptarTexto(localStorage.getItem(this.localStorageKeyToken));
    return token;
  }

  public borrarToken() {
    localStorage.removeItem(this.localStorageKeyToken);
  }
}