import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private router = inject(Router);

  validarRespuesta(respuesta: any) {
    if (respuesta && respuesta.status == 401) {
      this.router.navigate(['login']);
      return;
    }

    if (respuesta && respuesta.status == 500) {
      this.router.navigate(['500']);
      return;
    }

    if (respuesta && respuesta.status == 404) {
      this.router.navigate(['404']);
      return;
    }

  }

}
