import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
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
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public obtenerAdmin(idAdmin: string): Observable<RespuestaModel<AdministradorModel>> {
    const headers = this.obtenerHeaders();

    return this.http.get<any>(this.URL + '/' + idAdmin, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<AdministradorModel>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        if (respuestaMapeada.objeto.identificacion == this.obtenerAdminLocal()?.identificacion)
          this.cambiarAdminLocal(respuestaMapeada.objeto);

        respuestaMapeada.objeto = this.mapearAAdmin(respuesta.admin);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
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
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public editarAdmin(admin: AdministradorModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var adminMapeado = this.mapearAdmin(admin);

    return this.http.put<any>(this.URL + '/updated/' + admin.identificacion, adminMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message,
          admin: this.mapearAAdmin(respuesta.admin)
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
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
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  public cambiarClave(cambioDeClave: CambioDeClaveModel): Observable<RespuestaModel<any>> {
    const headers = this.obtenerHeaders();

    var cambioDeClaveMapeado = this.mapearCambioDeClave(cambioDeClave);

    return this.http.put<any>(this.URL + '/password/' + cambioDeClave.identificacion, cambioDeClaveMapeado, { headers }).pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<any>(respuesta, false);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = {
          mensaje: respuesta.message
        };
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  private mapearAdmin(administrador: AdministradorModel): any {
    return {
      identification: administrador.identificacion,
      name: administrador.nombre.trim(),
      cellphone: administrador.celular,
      admin_type: administrador.rol,
      password: administrador.clave,
      status: administrador.estado,
      has_temporary_password: administrador.tieneClaveTemporal,
      security_questions: administrador.datosSeguridad ? this.usuarioService.mapearDatosSeguridad(administrador.datosSeguridad) : null,
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
      identificacion: admin.identification?.toString() || '',
      nombre: admin.name,
      celular: admin.cellphone,
      rol: admin.admin_type,
      estado: admin.status,
      tieneClaveTemporal: admin.has_temporary_password,
      clave: admin.password || '',
      claveConfirmacion: admin.password || '',
      datosSeguridad: new DatosSeguridadModel()
    };
  }
}