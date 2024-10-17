import { DatosSeguridadModel } from '../usuarios/usuario.model';

export class AdministradorModel {
    identificacion: string = '';
    nombre: string = '';
    celular: string = '';
    clave: string = '';
    claveConfirmacion: string = '';
    estado: string = '';
    rol: string = '';
    datosSeguridad: DatosSeguridadModel = new DatosSeguridadModel();
    tieneClaveTemporal: boolean = false;
}
