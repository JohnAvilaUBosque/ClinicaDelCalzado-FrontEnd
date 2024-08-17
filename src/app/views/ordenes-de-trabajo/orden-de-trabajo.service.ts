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
    return this.http.get<any>(this.url).pipe(map(x => x['orders']));
  }

  obtenerOrden(idOrden: string): Observable<OrdenDeTrabajoModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idOrden);
    return this.obtenerOrdenes().pipe(map(
      ordenes => ordenes.find(orden => orden.orderNumber == idOrden)
    ))
  }

  crearOrden(orden: OrdenDeTrabajoModel): Observable<any> | void {
    // return this.http.post<any>(this.url, orden);
    console.log(orden)
  }

}
