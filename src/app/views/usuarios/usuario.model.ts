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
    seguridad: SeguridadModel = new SeguridadModel();
    claveNueva: string = '';
    claveConfirmacion: string = '';
}

export class SeguridadModel {
    pregunta1: string = '';
    respuesta1: string = '';
    pregunta2: string = '';
    respuesta2: string = '';
    pregunta3: string = '';
    respuesta3: string = '';
}