import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicioModel } from './servicio.model';
import { OrdenDeTrabajoModel } from '../ordenes-de-trabajo/orden-de-trabajo.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/ordenes-de-trabajo.json';

  obtenerServicios(): Observable<ServicioModel[]> {
    return this.http.get<any>(this.url).pipe(map(x => {
      var ordenes: OrdenDeTrabajoModel[] = [];
      var servicios: ServicioModel[] = [];
      var ordenesLocalStorage = localStorage.getItem('ORDENES');
      if (ordenesLocalStorage) {
        ordenes = JSON.parse(ordenesLocalStorage);
      }
      else {
        ordenes = x['ordenes'];
        localStorage.setItem('ORDENES', JSON.stringify(ordenes));
      }
      ordenes.forEach(orden => servicios.push(...orden.servicios));

      return servicios;
    }));
  }

  obtenerServicio(idServicio: number): Observable<ServicioModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idServicio);
    return this.obtenerServicios().pipe(map(
      servicios => {
        return servicios.find(servicio => servicio.id == idServicio);
      }
    ));
  }

  editarServicio(servicioEditado: ServicioModel): Observable<any> {
    return this.http.get<any>(this.url).pipe(map(x => {
      var ordenes: OrdenDeTrabajoModel[] = [];
      var ordenesLocalStorage = localStorage.getItem('ORDENES');
      if (ordenesLocalStorage) {
        ordenes = JSON.parse(ordenesLocalStorage);
      }
      else {
        ordenes = x['ordenes'];
      }
      
      var index: number;

      ordenes.forEach(orden => {
        if (index > -1) return false;

        index = orden.servicios.findIndex(s => s.id == servicioEditado.id);
        if (index > -1) {
          orden.servicios[index] = servicioEditado;
          return true;
        }
        return false;
      });

      localStorage.setItem('ORDENES', JSON.stringify(ordenes));
    }));
  }
}
