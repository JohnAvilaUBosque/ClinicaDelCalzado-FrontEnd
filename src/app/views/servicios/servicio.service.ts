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

  editarServicio(servicio: ServicioModel): Observable<any> {
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
      var comentario: string = '';

      ordenes.forEach(o => {
        if (index > -1) return;

        index = o.servicios.findIndex(s => s.id == servicio.id);
        if (index > -1) {
          comentario = 'Se edito el servicio "' + servicio.descripcion + '"';
          if (servicio.operario.nombre != o.servicios[index].operario.nombre)
            comentario += ', se cambió el operador a ' + servicio.operario.nombre;
          if (servicio.precio != o.servicios[index].precio)
            comentario += ', se cambió el precio a ' + servicio.precio;
          if (servicio.estado != o.servicios[index].estado)
            comentario += ', se cambió el estado a "' + servicio.estado;

          o.servicios[index] = servicio;
        }
      });

      localStorage.setItem('ORDENES', JSON.stringify(ordenes));

      return comentario;
    }));
  }
}
