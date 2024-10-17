import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdministradorModel } from './administrador.model';
import { CambioDeClaveModel } from '../usuarios/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/administradores.json';

  obtenerAdministradores(): Observable<AdministradorModel[]> {
    return this.http.get<any>(this.url).pipe(map(
      data => {
        var administradores = localStorage.getItem('ADMINS');
        if (administradores)
          return JSON.parse(administradores);

        administradores = data['admins'];
        localStorage.setItem('ADMINS', JSON.stringify(administradores));

        return administradores;
      }
    ));
  }

  obtenerAdministrador(id: string): Observable<AdministradorModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idOrden);
    return this.obtenerAdministradores().pipe(map(
      administradores => {
        return administradores.find(admin => admin.identificacion == id);
      }
    ));
  }

  crearAdministrador(administradorNuevo: AdministradorModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerAdministradores().pipe(map(
      administradores => {
        administradores.push(administradorNuevo);
        localStorage.setItem('ADMINS', JSON.stringify(administradores));
        return true;
      }
    ));
  }

  editarAdministrador(administradorEditado: AdministradorModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerAdministradores().pipe(map(
      administradores => {
        var index = administradores.findIndex(admin => admin.identificacion == administradorEditado.identificacion);
        administradores[index] = administradorEditado;
        if (administradores[index].tieneClaveTemporal) administradores[index].clave = 'Temp1234*'
        localStorage.setItem('ADMINS', JSON.stringify(administradores));
        return administradores[index];
      }
    ));
  }

  cambiarClave(cambioDeClave: CambioDeClaveModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerAdministradores().pipe(map(
      administradores => {
        var index = administradores.findIndex(admin => admin.identificacion == cambioDeClave.identificacion);
        administradores[index].clave = cambioDeClave.claveNueva;
        administradores[index].tieneClaveTemporal = false;
        localStorage.setItem('ADMINS', JSON.stringify(administradores));
        return administradores[index];
      }
    ));
  }

}
