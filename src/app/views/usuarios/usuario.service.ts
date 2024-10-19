import { inject, Injectable } from '@angular/core';
import { AdministradorModel } from '../admins/administrador.model';
import { UsuarioModel } from './usuario.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService {

  private http = inject(HttpClient);

  private CONST = inject(ConstantsService);

  private readonly localStorageKeyUser: string = 'U';
  private readonly localStorageKeyToken: string = 'T';

  private url: string = '/assets/dummy-data/administradores.json';

  obtenerAdministradores(): Observable<AdministradorModel[]> {
    return this.http.get<any>(this.url).pipe(map(
      respuesta => {
        this.validarRespuesta(respuesta);

        var administradores = localStorage.getItem('ADMINS');
        if (administradores)
          return JSON.parse(administradores);

        administradores = respuesta['admins'];
        localStorage.setItem('ADMINS', JSON.stringify(administradores));

        return administradores;
      }
    ));
  }

  iniciarSesion(usuario: UsuarioModel): Observable<any> {
    return this.obtenerAdministradores().pipe(map(
      respuesta => {
        this.validarRespuesta(respuesta);

        var admin = respuesta.find(admin => admin.identificacion == usuario.identificacion);
        if (!admin || admin.clave != usuario.clave) {
          return {
            error: 'UNAUTHORIZED',
            message: 'Credenciales inválidas, intente nuevamente!'
          };
        }

        if (admin.estado == this.CONST.ESTADO_ADMIN.INACTIVO) {
          return {
            error: 'UNAUTHORIZED',
            message: 'Usuario inactivo, contacte al administrador principal!'
          };
        }

        return {
          message: 'Inicio de sesión exitoso',
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          token_type: 'Bearer ',
          has_temporary_password: true
       };
      }
    ));
  }

  cambiarAdminLocal(admin: AdministradorModel) {
    var adminJson = admin ? JSON.stringify(admin) : '';
    localStorage.setItem(this.localStorageKeyUser, this.CONST.encriptarTexto(adminJson) ?? '')
  }

  obtenerAdminLocal(): AdministradorModel {
    var adminJson = this.CONST.desencriptarTexto(localStorage.getItem(this.localStorageKeyUser));
    return adminJson ? JSON.parse(adminJson ?? '') : null;
  }

  cambiarToken(token: string) {
    localStorage.setItem(this.localStorageKeyToken, this.CONST.encriptarTexto(token) ?? '')
  }

  obtenerToken(): string | null {
    var token = this.CONST.desencriptarTexto(localStorage.getItem(this.localStorageKeyToken));
    return token;
  }

  cerrarSesion() {
    localStorage.removeItem(this.localStorageKeyUser);
    localStorage.removeItem(this.localStorageKeyToken);
  }

}
