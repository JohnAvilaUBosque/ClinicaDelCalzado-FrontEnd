export const API_URL = 'https://api.example.com';
export const ORDEN_NUMBER_DEFAULT = 'ORD-####-#####';

export enum FORMATS_API {
    DATETIME = 'yyyy-MM-dd hh:mm',
    DATE = 'yyyy-MM-dd',
    TIME = 'hh:mm'
}

export enum FORMATS_VIEW {
    DATETIME = 'dd/MM/yyyy hh:mm',
    DATE = 'dd/MM/yyyy',
    TIME = 'hh:mm'
}

export class REGULAR_EXP {
    CURRENCY = /^\$\d{1,3}(\,\d{3})*$/;
    NUMBER = /[^0-9]/g;
}

export enum ESTADO_ORDEN {
    VIGENTE = 'Vigente',
    CANCELADA = 'Cancelada',
}

export enum ESTADO_PAGO {
    PENDIENTE = 'Pendiente',
    PAGADO = 'Pagado',
}

export enum ESTADO_SERVICIO {
    RECIBIDO = 'Recibido',
    TERMINADO = 'Terminado',
    DESPACHADO = 'Despachado'
}

export enum ESTADO_ADMIN {
    ACTIVO = 'Activo',
    INACTIVO = 'Inactivo',
}

export enum ROL_ADMIN {
    PRINCIPAL = 'Principal',
    SECUNDARIO = 'Secundario',
}
