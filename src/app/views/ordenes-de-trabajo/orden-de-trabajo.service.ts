import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenDeTrabajoModel } from './orden-de-trabajo.model';
import { map, Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { ServicioModel } from '../servicios/servicio.model';

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
        var servicios: ServicioModel[] = [];
        ordenes.forEach(orden => servicios.push(...orden.servicios));
        var ultimoId = servicios.sort(s => s.id).map((s => s.id)).pop();
        ordenNueva.servicios.forEach(s => {
          if (ultimoId) {
            ultimoId++;
            s.id = ultimoId;
          }
        })

        ordenNueva.numeroOrden = this.obtenerSiguienteNumero(ordenes, ordenNueva.fechaCreacion);
        ordenes.push(ordenNueva);
        localStorage.setItem('ORDENES', JSON.stringify(ordenes));
      }
    ));
  }

  migrarOrden(ordenNueva: OrdenDeTrabajoModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOrdenes().pipe(map(
      ordenes => {
        var servicios: ServicioModel[] = [];
        ordenes.forEach(orden => servicios.push(...orden.servicios));
        var ultimoId = servicios.sort(s => s.id).map((s => s.id)).pop();
        ordenNueva.servicios.forEach(s => {
          if (ultimoId) {
            ultimoId++;
            s.id = ultimoId;
          }
        })

        ordenNueva.numeroOrden = this.obtenerSiguienteNumero(ordenes, ordenNueva.fechaCreacion);
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

  private obtenerSiguienteNumero(ordenes: OrdenDeTrabajoModel[], fechaCreacion: string) {
    var ultimaOrden = ordenes.sort(orden => new Date(orden.fechaCreacion).getTime()).pop();
    var siguienteNumero: string = '';
    if (ultimaOrden) {
      var ultimoNumero = ultimaOrden.numeroOrden.substring(13);
      var numero = parseInt(ultimoNumero) + 1;
      siguienteNumero = numero.toString().padStart(5, '0');
    }
    return 'ORD-' + formatDate(fechaCreacion, 'yyyyMMdd', 'en-US') + '-' + siguienteNumero || '00001';
  }

}
