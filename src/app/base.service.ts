import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorModel } from './error.model';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  public http = inject(HttpClient);
  public router = inject(Router);
  public CONST = inject(ConstantsService);

  public validarRespuesta(respuesta: any): ErrorModel | any {
    var respuestaMapeada = this.mapearRespuesta(respuesta);
    
    if (respuesta && respuesta.status == 401) {
      this.router.navigate(['login']);
      return respuestaMapeada;
    }

    // if (respuesta && respuesta.status == 500) {
    //   this.router.navigate(['500']);
    //   return respuestaMapeada;
    // }

    return respuestaMapeada;
  }

  private mapearRespuesta(respuesta: any): ErrorModel | any {
    if (respuesta.error) {
      var error = new ErrorModel();
      error.esError = true;
      error.tipo = respuesta.error;
      error.estado = respuesta.status;
      error.mensaje = respuesta.message;
      return error;
    }

    return respuesta;
  }

}
