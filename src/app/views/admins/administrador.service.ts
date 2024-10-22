import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdministradorModel } from './administrador.model';
import { CambioDeClaveModel, DatosSeguridadModel } from '../usuarios/usuario.model';
import { BaseService } from 'src/app/base.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { RespuestaModel } from 'src/app/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService extends BaseService {

  public usuarioService = inject(UsuarioService);

  private readonly URL: string = this.CONST.API_URL + '/api/v1/admins';

  public obtenerAdmins(): Observable<RespuestaModel<AdministradorModel[]>> {
    const headers = this.obtenerHeaders();
    
    return this.http.get<any>(this.URL + '/list', { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<AdministradorModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAAdmins(respuesta.admins);
        return respuestaMapeada;
      }
    ));
  }

  public obtenerAdmin(idAdmin: string): Observable<RespuestaModel<AdministradorModel>> {
    const headers = this.obtenerHeaders();
    
    return this.http.get<any>(this.URL + '/' + idAdmin, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<AdministradorModel>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAAdmin(respuesta.admin);
        return respuestaMapeada;
      }
    ));
  }

  public crearAdmin(admin: AdministradorModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();
    
    var adminMapeado = this.mapearAdmin(admin);

    return this.http.post<any>(this.URL + '/created', adminMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          admin: this.mapearAAdmin(respuesta.admin)
        };
        return respuestaMapeada;
      }
    ));
  }

  public editarAdmin(admin: AdministradorModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();
    
    var adminMapeado = this.mapearAdmin(admin);

    return this.http.put<any>(this.URL + '/' + admin.identificacion, adminMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          admin: this.mapearAAdmin(respuesta.admin)
        };
        return respuestaMapeada;
      }
    ));
  }

  public editarInfoPersonal(admin: AdministradorModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();
    
    var adminMapeado = this.mapearAdmin(admin);

    return this.http.put<any>(this.URL + '/edit-personal-information/' + admin.identificacion, adminMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          admin: this.mapearAAdmin(respuesta.admin)
        };
        return respuestaMapeada;
      }
    ));
  }

  public cambiarClave(cambioDeClave: CambioDeClaveModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();
    
    var cambioDeClaveMapeado = this.mapearCambioDeClave(cambioDeClave);

    return this.http.put<any>(this.URL + '/password/' + cambioDeClave.identificacion, cambioDeClaveMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message
        };
        return respuestaMapeada;
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
      has_temporary_password: admin.tieneClaveTemporal,
      security_questions: admin.datosSeguridad ? this.usuarioService.mapearDatosSeguridad(admin.datosSeguridad) : null,
    };
  }

  private mapearCambioDeClave(cambioDeClave: CambioDeClaveModel): any {
    return {
      identification: cambioDeClave.identificacion,
      old_password: cambioDeClave.claveActual,
      new_password: cambioDeClave.claveNueva,
      confirm_new_password: cambioDeClave.claveConfirmacion
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
}