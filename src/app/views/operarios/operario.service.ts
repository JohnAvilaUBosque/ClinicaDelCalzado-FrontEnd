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

}
