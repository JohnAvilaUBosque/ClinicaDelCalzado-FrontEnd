import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OperarioModel } from './operario.model';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class OperarioService extends BaseService {

  url: string = '/assets/dummy-data/operarios.json';

  public obtenerOperarios(): Observable<OperarioModel[]> {
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

  public obtenerOperario(id: string): Observable<OperarioModel | undefined> {
    // return this.http.get<any>(this.url + '/' + idOrden);
    return this.obtenerOperarios().pipe(map(
      operarios => {
        return operarios.find(admin => admin.identificacion == id);
      }
    ));
  }

  public crearOperario(operarioNuevo: OperarioModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOperarios().pipe(map(
      operarios => {
        operarios.push(operarioNuevo);
        localStorage.setItem('OPERARIOS', JSON.stringify(operarios));
        return true;
      }
    ));
  }

  public editarOperario(operarioEditado: OperarioModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerOperarios().pipe(map(
      operarios => {
        var index = operarios.findIndex(admin => admin.identificacion == operarioEditado.identificacion);
        operarios[index] = operarioEditado;
        localStorage.setItem('OPERARIOS', JSON.stringify(operarios));
      }
    ));
  }

  public mapearOperario(operario: OperarioModel): any {
    return {
      id_operator: operario.identificacion,
      operator_name: operario.nombre,
      x: operario.celular, // TO DO: Pendiente definir
      y: operario.estado // TO DO: Pendiente definir
    };
  }

  public mapearAOperario(operario: any): OperarioModel {
    return {
      identificacion: operario.id_operator,
      nombre: operario.operator_name,
      celular: operario.x, // TO DO: Pendiente definir
      estado: operario.y // TO DO: Pendiente definir
    };
  }

}
