import { ServicioModel } from '../servicios/servicio.model';
import { ClienteModel } from '../clientes/cliente.model';

export class OrdenDeTrabajoModel {
    numeroOrden: string = '';
    atendidoPor: string = '';
    fechaCreacion: string = '';
    estadoOrden: string = '';
    cliente: ClienteModel = new ClienteModel();
    precioTotal: number = 0;
    abono: number = 0;
    saldo: number = 0;
    estadoPago: string = '';
    fechaEntrega: string = '';
    servicios: ServicioModel[] = [];
    cantidadServicios: number = 0;
    comentarios: ComentarioModel[] = [];
}

export class ComentarioModel {
    id: number = 0;
    descripcion: string = '';
    nombreAdmin: string = '';
    fecha: string = '';
}