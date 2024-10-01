import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdministradorModel } from './administrador.model';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/administradores.json';

  obtenerAdministradores(): Observable<AdministradorModel[]> {
    return this.http.get<any>(this.url).pipe(map(
      administradores => {
        var administradoresJson = localStorage.getItem('ADMINS');
        if (administradoresJson)
          return JSON.parse(administradoresJson);

        localStorage.setItem('ADMINS', JSON.stringify(administradores['admins']));
        return administradores['admins'];
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
        localStorage.setItem('ADMINS', JSON.stringify(administradores));
      }
    ));
  }

}
