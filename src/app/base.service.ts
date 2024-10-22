import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorModel, RespuestaModel } from './respuesta.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected http = inject(HttpClient);
  protected router = inject(Router);
  protected CONST = inject(ConstantsService);

  private readonly localStorageKeyToken: string = 'T';

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

  public obtenerHeaders(): HttpHeaders {
    var token = this.obtenerToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
    return headers;
  }

  protected validarRespuesta<T>(respuesta: any): RespuestaModel<T> {
    var respuestaMapeada = this.mapearRespuesta<T>(respuesta);

    if (respuesta && respuesta.status == 401) {
      this.router.navigate(['login']);
      return respuestaMapeada;
    }

    if (respuesta && respuesta.status == 403) {
      this.router.navigate(['login']);
      return respuestaMapeada;
    }

    // if (respuesta && respuesta.status == 500) {
    //   this.router.navigate(['500']);
    //   return respuestaMapeada;
    // }

    return respuestaMapeada;
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

  gestionarError(error: HttpErrorResponse ) {
    this.CONST.ocultarCargando();
    console.error(error);
    this.router.navigate(['500']);
  }
}