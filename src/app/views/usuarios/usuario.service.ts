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
    var admin_json = admin ? JSON.stringify(admin) : '';
    localStorage.setItem(this.localStorageKeys.user, admin_json)
  }

  obtenerAdminLocal(): AdministradorModel {
    var admin_json = localStorage.getItem(this.localStorageKeys.user);
    return admin_json ? JSON.parse(admin_json ? admin_json : '') : null;
  }
}
