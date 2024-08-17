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
