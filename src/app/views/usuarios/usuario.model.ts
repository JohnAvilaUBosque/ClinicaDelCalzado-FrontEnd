export class UsuarioModel {
    identificacion: string = '';
    clave: string = '';
}

export class CambioDeClaveModel {
    identificacion: string = '';
    claveActual: string = '';
    claveNueva: string = '';
    claveConfirmacion: string = '';
}

export class RecuperacionModel {
    identificacion: string = '';
    claveNueva: string = '';
    claveConfirmacion: string = '';
    datosSeguridad: DatosSeguridadModel = new DatosSeguridadModel();
}

export class DatosSeguridadModel {
    pregunta1: number = 0;
    respuesta1: string = '';
    pregunta2: number = 0;
    respuesta2: string = '';
    pregunta3: number = 0;
    respuesta3: string = '';
}