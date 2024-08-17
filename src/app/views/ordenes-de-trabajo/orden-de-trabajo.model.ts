import { ServicioModel } from './servicio.model'

export class OrdenDeTrabajoModel {
    orderNumber: string = '';
    attendedBy: string = '';
    identification: string = '';
    name: string = '';
    phone: string = '';
    date: string = '';
    productCount: number = 0;
    paymentStatus: string = '';
    totalValue: number = 0;
    payment: number = 0;
    balance: number = 0;
    orderStatus: string = '';
    deadline: string = '';
    comment: string = '';
    services: ServicioModel[] = [];
}