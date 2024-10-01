import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenDeTrabajoModel } from './orden-de-trabajo.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenDeTrabajoService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/ordenes-de-trabajo.json';

  obtenerOrdenes(): Observable<OrdenDeTrabajoModel[]> {
    return this.http.get<any>(this.url).pipe(map(
      ordenes => {
        var ordenesJson = localStorage.getItem('ORDENES');
        if (ordenesJson)
          return JSON.parse(ordenesJson);

        localStorage.setItem('ORDENES', JSON.stringify(ordenes['ordenes']));
        return ordenes['ordenes'];
      }
    ));
  }

  obtenerOrden(idOrden: string): Observable<OrdenDeTrabajoModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idOrden);
    return this.obtenerOrdenes().pipe(map(
      ordenes => {
        return ordenes.find(orden => orden.numeroOrden == idOrden);
      }
    ));
  }

  crearOrden(ordenNueva: OrdenDeTrabajoModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOrdenes().pipe(map(
      ordenes => {
        // ordenNueva.numeroOrden = String.format("%05d", numero);
        ordenes.push(ordenNueva);
        localStorage.setItem('ORDENES', JSON.stringify(ordenes));
      }
    ));
  }

  editarOrden(ordenEditada: OrdenDeTrabajoModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOrdenes().pipe(map(
      ordenes => {
        var index = ordenes.findIndex(orden => orden.numeroOrden == ordenEditada.numeroOrden);
        ordenes[index] = ordenEditada;
        localStorage.setItem('ORDENES', JSON.stringify(ordenes));
      }
    ));
  }
}
