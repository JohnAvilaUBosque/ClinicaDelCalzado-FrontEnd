export class InformeDetalladoModel {
    numeroOrden: string = '';
    estadoOrden: string = '';
    fechaCreacion: string = '';
    precioTotal: number = 0;
    abono: number = 0;
    saldo: number = 0;
    serviciosRecibidos: number = 0;
    serviciosTerminados: number = 0;
    serviciosDespachados: number = 0;
}

export class InformeGeneralModel {
    fecha: string = '';
    precioTotal: number = 0;
    abono: number = 0;
    saldo: number = 0;
    serviciosRecibidos: number = 0;
    serviciosTerminados: number = 0;
    serviciosDespachados: number = 0;
}