import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OperarioModel } from './operario.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperarioService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/operarios.json';

  obtenerOperarios(): Observable<OperarioModel[]> {
    return this.http.get<any>(this.url).pipe(map(
      operarios => {
        var operariosJson = localStorage.getItem('OPERARIOS');
        if (operariosJson)
          return JSON.parse(operariosJson);

        localStorage.setItem('OPERARIOS', JSON.stringify(operarios['operarios']));
        return operarios['operarios'];
      }
    ));
  }

  obtenerOperario(id: string): Observable<OperarioModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idOrden);
    return this.obtenerOperarios().pipe(map(
      operarios => {
        return operarios.find(admin => admin.identificacion == id);
      }
    ));
  }

  crearOperario(operarioNuevo: OperarioModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOperarios().pipe(map(
      operarios => {
        operarios.push(operarioNuevo);
        localStorage.setItem('OPERARIOS', JSON.stringify(operarios));
        return true;
      }
    ));
  }

  editarOperario(operarioEditado: OperarioModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOperarios().pipe(map(
      operarios => {
        var index = operarios.findIndex(admin => admin.identificacion == operarioEditado.identificacion);
        operarios[index] = operarioEditado;
        localStorage.setItem('OPERARIOS', JSON.stringify(operarios));
      }
    ));
  }

}
