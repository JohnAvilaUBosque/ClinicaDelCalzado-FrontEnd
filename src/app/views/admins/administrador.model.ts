import { SeguridadModel as SeguridadModel } from "../usuarios/usuario.model";

export class AdministradorModel {
    identificacion: string = '';
    nombre: string = '';
    celular: string = '';
    clave: string = '';
    claveConfirmacion: string = '';
    estado: string = '';
    rol: string = '';
    seguridad: SeguridadModel = new SeguridadModel();
}
