// URL de la API del backend
export const API_URL = 'https://clinicadelcalzado-backend-latest.onrender.com';

// CONSTANTES DE LA EMPRESA

export const NOMBRE_EMPRESA = 'Clínica del calzado';

export const CANT_FILAS_POR_PAGINA = 10;

export enum ESTADO_ORDEN {
    VIGENTE = 'VIGENTE',
    ANULADA = 'ANULADA',
    FINALIZADA = 'FINALIZADA',
};

export enum ESTADO_PAGO {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
};

export enum ESTADO_SERVICIO {
    RECIBIDO = 'EN PROCESO',
    TERMINADO = 'TERMINADO',
    DESPACHADO = 'DESPACHADO'
};

export enum ESTADO_OPERARIO {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
};

export enum ESTADO_ADMIN {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
};

export enum ROL_ADMIN {
    PRINCIPAL = 'PRINCIPAL',
    SECUNDARIO = 'SECUNDARIO',
};

// CONSTANTES TECNICAS

export const WHATSAPP_URL = 'https://wa.me/+57';

export const ORDEN_NUMBER_DEFAULT = 'ORD-YYYYMMDD-#####';

export enum FORMATS_API {
    DATETIME = 'yyyy-MM-dd HH:mm',
    DATE = 'yyyy-MM-dd',
    TIME = 'HH:mm'
};

export enum FORMATS_VIEW {
    DATETIME = 'dd/MM/yyyy hh:mm a',
    DATE = 'dd/MM/yyyy',
    TIME = 'hh:mm a',
    TIME_ONLY = 'hh:mm'
};

export class REGULAR_EXP {
    readonly CURRENCY = /^\$\d{1,3}(\,\d{3})*$/;
    readonly NOT_NUMBER = /[^0-9]/g;
    readonly NUMBER = /^\d+$/;
    readonly PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    readonly TIME = '^(0?[1-9]|1[0-2]):[0-5][0-9]$';
};
