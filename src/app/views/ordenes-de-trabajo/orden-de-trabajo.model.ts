import { ServicioModel } from './servicio.model'

export class OrdenDeTrabajoModel {
    orderNumber: string = '';
    attendedById: number = 0;
    attendedBy: string = '';
    createDate: string = '';
    orderStatus: string = '';
    client: ClienteModel = new ClienteModel();
    totalValue: number = 0;
    downPayment: number = 0;
    balance: number = 0;
    paymentStatus: string = '';
    comment: string = '';
    deliveryDate: string = '';
    services: ServicioModel[] = [];
    servicesCount: number = 0;
}

class ClienteModel {
    identification: string = '';
    name: string = '';
    cellphone: string = '';
}