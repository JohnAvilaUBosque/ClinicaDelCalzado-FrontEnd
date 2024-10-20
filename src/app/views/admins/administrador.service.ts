import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdministradorModel } from './administrador.model';
import { CambioDeClaveModel, DatosSeguridadModel } from '../usuarios/usuario.model';
import { ErrorModel } from 'src/app/error.model';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService extends BaseService {

  private readonly URL: string = this.CONST.API_URL + '/api/v1/work-orders';

  public obtenerAdmins(): Observable<ErrorModel | AdministradorModel[]> {
    return this.http.get<any>(this.URL + '/list').pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAAdmins(respuesta.admins);
      }
    ));
  }

  public obtenerAdmin(idAdmin: string): Observable<ErrorModel | AdministradorModel[]> {
    return this.http.get<any>(this.URL + '/' + idAdmin).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return this.mapearAAdmin(respuesta.admin);
      }
    ));
  }

  public crearAdmin(administrador: AdministradorModel): Observable<ErrorModel | any> {
    var administradorMapeado = this.mapearAdmin(administrador);

    return this.http.post<any>(this.URL + '/created', administradorMapeado).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message,
          admin: this.mapearAAdmin(respuesta.admin)
        };
      }
    ));
  }

  public editarAdministrador(administrador: AdministradorModel): Observable<ErrorModel | any> {
    var administradorMapeado = this.mapearAdmin(administrador);

    return this.http.put<any>(this.URL + '/' + administrador.identificacion, administradorMapeado).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        return {
          mensaje: respuesta.message,
          admin: this.mapearAAdmin(respuesta.admin)
        };
      }
    ));
  }

  private mapearAdmin(admin: AdministradorModel): any {
    return {
      identification: admin.identificacion,
      name: admin.nombre,
      cellphone: admin.celular,
      phone: admin.celular, // TO DO: Pendiente definir si quitar
      admin_type: admin.rol,
      password: admin.clave,
      admin_status: admin.estado, // TO DO: Pendiente definir si quitar
      status: admin.estado,
      has_temporary_password: admin.tieneClaveTemporal
    };
  }

  private mapearAAdmins(admins: any[]): AdministradorModel[] {
    return admins.map(
      admin => {
        return this.mapearAAdmin(admin);
      });
  }

  private mapearAAdmin(admin: any): AdministradorModel {
    return {
      identificacion: admin.identification,
      nombre: admin.name,
      celular: admin.phone, // TO DO: Pendiente definir si quitar
      // celular: admin.cellphone, // TO DO: Pendiente definir si activar
      rol: admin.admin_type,
      estado: admin.status,
      tieneClaveTemporal: admin.has_temporary_password,
      clave: admin.password || '',
      claveConfirmacion: admin.password || '',
      datosSeguridad: new DatosSeguridadModel()
    };
  }

  public cambiarClave(cambioDeClave: CambioDeClaveModel): Observable<any> {
    // return this.http.post<any>(this.url, orden);
    return this.obtenerAdmins().pipe(map(
      administradores => {
        var index = administradores.findIndex(admin => admin.identificacion == cambioDeClave.identificacion);
        administradores[index].clave = cambioDeClave.claveNueva;
        administradores[index].tieneClaveTemporal = false;
        localStorage.setItem('ADMINS', JSON.stringify(administradores));
        return administradores[index];
      }
    ));
  }

}
