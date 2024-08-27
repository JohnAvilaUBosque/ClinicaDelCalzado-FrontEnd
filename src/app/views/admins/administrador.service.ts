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
    return this.http.get<any>(this.url).pipe(map(x => x['admins']));
  }

  obtenerAdministrador(id: number): Observable<AdministradorModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idOrden);
    return this.obtenerAdministradores().pipe(map(
      administradores => administradores.find(admin => admin.identification == id)
    ))
  }

  crearAdministrador(administrador: AdministradorModel): Observable<any> | void {
    // return this.http.post<any>(this.url, orden);
    console.log(administrador)
  }

  editarAdministrador(administrador: AdministradorModel): Observable<any> | void {
    // return this.http.post<any>(this.url, orden);
    console.log(administrador)
  }
}
