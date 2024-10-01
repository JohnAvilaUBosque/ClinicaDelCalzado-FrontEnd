export class UsuarioModel {
    identificacion: string = '';
    clave: string = '';
}

export class CambioDeClaveModel {
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
    pregunta1: string = '';
    respuesta1: string = '';
    pregunta2: string = '';
    respuesta2: string = '';
    pregunta3: string = '';
    respuesta3: string = '';
}