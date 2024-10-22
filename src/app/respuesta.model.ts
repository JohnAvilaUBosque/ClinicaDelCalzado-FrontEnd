export class RespuestaModel<T> {
    esError: boolean = false;
    error!: ErrorModel;
    objeto!: T;
}

export class ErrorModel {
    tipo: string = '';
    estado: number = 0;
    mensaje: string = '';
}