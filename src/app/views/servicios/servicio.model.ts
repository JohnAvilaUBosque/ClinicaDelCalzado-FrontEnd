import { OperarioModel } from '../operarios/operario.model';

export class ServicioModel {
    id: number = 0;
    descripcion: string = '';
    estado: string = '';
    precio: number = 0;
    precioEstablecido: boolean = false;
    operario: OperarioModel = new OperarioModel();
}