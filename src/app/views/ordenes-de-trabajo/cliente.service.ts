import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClienteModel } from './cliente.model';
import { map, Observable } from 'rxjs';
import { OrdenDeTrabajoModel } from './orden-de-trabajo.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/ordenes-de-trabajo.json';

  obtenerClientes(): Observable<ClienteModel[]> {
    return this.http.get<any>(this.url).pipe(map(x => {
      var ordenes: OrdenDeTrabajoModel[] = [];
      var clientes: ClienteModel[];
      var ordenesJson = localStorage.getItem('ORDENES');
      if (ordenesJson) {
        ordenes = JSON.parse(ordenesJson);
        clientes = ordenes.map(orden => orden.cliente);
      }
      else {
        ordenes = x['ordenes'];
        localStorage.setItem('ORDENES', JSON.stringify(ordenes));
        clientes = ordenes.map(orden => orden.cliente);
      }

      return clientes;
    }
    ));
  }

}
