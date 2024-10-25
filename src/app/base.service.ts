import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorModel, RespuestaModel } from './respuesta.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { throwError } from 'rxjs';
import { AdministradorModel } from './views/admins/administrador.model';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected http = inject(HttpClient);
  protected router = inject(Router);
  protected CONST = inject(ConstantsService);

  public cerrarSesion() {
    this.borrarAdminLocal();
    this.borrarToken();
  }

  // ADMIN LOCAL

  private readonly localStorageKeyUser: string = 'U';

  public obtenerAdminLocal(): AdministradorModel {
    var adminJson = this.CONST.desencriptarTexto(localStorage.getItem(this.localStorageKeyUser));
    return adminJson ? JSON.parse(adminJson ?? '') : null;
  }

  public cambiarAdminLocal(admin: AdministradorModel) {
    var adminJson = admin ? JSON.stringify(admin) : '';
    localStorage.setItem(this.localStorageKeyUser, this.CONST.encriptarTexto(adminJson) ?? '')
  }

  private borrarAdminLocal() {
    localStorage.removeItem(this.localStorageKeyUser);
  }

  // TOKEN

  private readonly localStorageKeyToken: string = 'T';

  public obtenerToken(): string | null {
    var token = this.CONST.desencriptarTexto(localStorage.getItem(this.localStorageKeyToken));
    return token;
  }

  protected cambiarToken(token: string) {
    localStorage.setItem(this.localStorageKeyToken, this.CONST.encriptarTexto(token) ?? "")
  }

  private borrarToken() {
    localStorage.removeItem(this.localStorageKeyToken);
  }

  // HTTP

  protected obtenerHeaders(): HttpHeaders {
    var token = this.obtenerToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    return headers;
  }

  protected validarRespuesta<T>(respuesta: any, validar401y403: boolean = true): RespuestaModel<T> {
    var respuestaMapeada = this.mapearRespuesta<T>(respuesta);
    if (respuestaMapeada.esError) this.gestionarError(respuesta);
    return respuestaMapeada;
  }

  protected controlarError(error: HttpErrorResponse, validar401y403: boolean = true) {
    this.gestionarError(error.error, validar401y403);
    return throwError(() => error);
  }

  private mapearRespuesta<T>(respuesta: any): RespuestaModel<T> {
    var respuestaMapeada = new RespuestaModel<T>();

    if (respuesta.error) {
      var error = new ErrorModel();
      error.tipo = respuesta.error;
      error.estado = respuesta.status;
      error.mensaje = respuesta.message;

      respuestaMapeada.esError = true;
      respuestaMapeada.error = error;
      return respuestaMapeada;
    }

    respuestaMapeada.esError = false;
    respuestaMapeada.objeto = respuesta;
    return respuestaMapeada;
  }

  private gestionarError(respuesta: any, validar401y403: boolean = true) {
    this.CONST.ocultarCargando();
    this.CONST.mostrarMensajeError(respuesta?.message || 'Error interno, comuniquese con el administrador.');

    if (respuesta && respuesta.status) {
      if (validar401y403 && respuesta.status == 401) {
        this.router.navigate(['login']);
        return;
      }

      if (validar401y403 && respuesta.status == 403) {
        this.router.navigate(['']);
        return;
      }

      // if (respuesta.status == 500) {
      //   this.router.navigate(['500']);
      //   return;
      // }
    }
  }
}