export class UsuarioModel {
    id: string = '';
    name: string = '';
    rol: string = '';
    clave: string = '';
}

export class CambioDeClaveModel {
    claveActual: string = '';
    claveNueva: string = '';
    claveConfirmacion: string = '';
}
