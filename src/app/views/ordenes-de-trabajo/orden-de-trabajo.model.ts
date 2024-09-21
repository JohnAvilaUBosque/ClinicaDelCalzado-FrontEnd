import { ServicioModel } from './servicio.model';
import { ClienteModel } from './client.model';

export class OrdenDeTrabajoModel {
    orderNumber: string = '';
    attendedById: string = '';
    attendedBy: string = '';
    createDate: string = '';
    orderStatus: string = '';
    client: ClienteModel = new ClienteModel();
    totalValue: number = 0;
    downPayment: number = 0;
    balance: number = 0;
    paymentStatus: string = '';
    comments: ComentarioModel[] = [];
    deliveryDate: string = '';
    services: ServicioModel[] = [];
    servicesCount: number = 0;
}

export class ComentarioModel {
    comment: string = '';
    adminName?: string = '';
    date: string = '';
}