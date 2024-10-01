import { Injectable } from '@angular/core';
import { AdministradorModel } from '../admins/administrador.model';
import { UsuarioModel } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  readonly localStorageKeys = {
    user: 'USER'
  };

  iniciarSesion(usuario: UsuarioModel) {
    throw new Error('Method not implemented');
  }

  cambiarAdminLocal(admin: AdministradorModel) {
    var adminJson = admin ? JSON.stringify(admin) : '';
    localStorage.setItem(this.localStorageKeys.user, adminJson)
  }

  obtenerAdminLocal(): AdministradorModel {
    var adminJson = localStorage.getItem(this.localStorageKeys.user);
    return adminJson ? JSON.parse(adminJson ? adminJson : '') : null;
  }
}
