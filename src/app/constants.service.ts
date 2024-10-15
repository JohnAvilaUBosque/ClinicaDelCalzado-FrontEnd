import { Injectable } from '@angular/core';
import { FORMATS_VIEW, FORMATS_API, API_URL, ORDEN_NUMBER_DEFAULT, REGULAR_EXP, ESTADO_PAGO, ESTADO_SERVICIO, ESTADO_ORDEN, ESTADO_ADMIN, ROL_ADMIN, NOMBRE_EMPRESA, WHATSAPP_URL, ESTADO_OPERARIO, CANT_FILAS_POR_PAGINA } from './globals'
import { formatCurrency, formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public readonly API_URL = API_URL;

  public readonly NOMBRE_EMPRESA = NOMBRE_EMPRESA;
  public readonly CANT_FILAS_POR_PAGINA = CANT_FILAS_POR_PAGINA;
  public readonly ESTADO_ORDEN = ESTADO_ORDEN;
  public readonly ESTADO_PAGO = ESTADO_PAGO;
  public readonly ESTADO_SERVICIO = ESTADO_SERVICIO;
  public readonly ESTADO_OPERARIO = ESTADO_OPERARIO;
  public readonly ESTADO_ADMIN = ESTADO_ADMIN;
  public readonly ROL_ADMIN = ROL_ADMIN;

  public readonly WHATSAPP_URL = WHATSAPP_URL;
  public readonly ORDEN_NUMBER_DEFAULT = ORDEN_NUMBER_DEFAULT;

  public readonly FORMATS_VIEW = FORMATS_VIEW;
  public readonly FORMATS_API = FORMATS_API;
  public readonly REGULAR_EXP = new REGULAR_EXP();

  fechaATexto(fecha: string | number | Date, formato: string) {
    return formatDate(fecha, formato, 'en-US');
  }

  monedaATexto(valor: number) : string {
    return formatCurrency(valor, 'en-US', '$', 'COP', '1.0');
  }

  textoAFecha(texto: string): Date | null {
    var tiempo = Date.parse(texto);

    if (isNaN(tiempo))
      return null;

    return new Date(tiempo);
  }
}
