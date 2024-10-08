import { Injectable } from '@angular/core';
import { AdministradorModel } from '../admins/administrador.model';
import { UsuarioModel } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  readonly localStorageKey: string = 'USER';

  iniciarSesion(usuario: UsuarioModel) {
    throw new Error('Method not implemented');
  }

  cambiarAdminLocal(admin: AdministradorModel) {
    var adminJson = admin ? JSON.stringify(admin) : '';
    localStorage.setItem(this.localStorageKey, adminJson)
  }

  obtenerAdminLocal(): AdministradorModel {
    var adminJson = localStorage.getItem(this.localStorageKey);
    return adminJson ? JSON.parse(adminJson ? adminJson : '') : null;
  }

  cerrarSesion() {
    localStorage.removeItem(this.localStorageKey);
  }

}
