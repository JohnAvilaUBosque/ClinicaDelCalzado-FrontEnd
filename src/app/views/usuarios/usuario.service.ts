import { Injectable } from '@angular/core';
import { UsuarioModel } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  readonly localStorageKeys = {
    user: 'USER'
  };

  constructor() { 
    this.crearUsuarioLocalFake(); // TO DO: Cambiar el usuario local en el login
  }

  private crearUsuarioLocalFake() {
    var usuario = new UsuarioModel();
    usuario.id = 1;
    usuario.name = 'Liliana Morantes';
    usuario.email = 'lili@mail.com';
    this.cambiarUsuarioLocal(usuario);
  }

  cambiarUsuarioLocal(usuario: UsuarioModel) {
    var usuario_json = usuario ? JSON.stringify(usuario) : '';
    localStorage.setItem(this.localStorageKeys.user, usuario_json)
  }

  obtenerUsuarioLocal(): UsuarioModel {
    var usuario_json = localStorage.getItem(this.localStorageKeys.user);
    return usuario_json ? JSON.parse(usuario_json) : null;
  }
}
