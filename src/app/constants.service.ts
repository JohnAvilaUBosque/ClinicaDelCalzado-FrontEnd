import { Injectable } from '@angular/core';
import { FORMATS_VIEW, FORMATS_API, API_URL, ORDEN_NUMBER_DEFAULT, REGULAR_EXP, ESTADO_PAGO, ESTADO_SERVICIO, ESTADO_ORDEN, ESTADO_ADMIN, ROL_ADMIN, NOMBRE_EMPRESA, WHATSAPP_URL, ESTADO_OPERARIO, CANT_FILAS_POR_PAGINA } from './globals'
import { formatCurrency, formatDate } from '@angular/common';
import * as CryptoJS from 'crypto-js';

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

  fechaATexto(fecha: string | number | Date, formato: string): string {
    return formatDate(fecha, formato, 'en-US');
  }

  textoAFecha(texto: string | number): Date | null {
    var fecha = this.fechaATexto(texto, this.FORMATS_API.DATE);

    if (!fecha)
      return null;

    return new Date(fecha);
  }

  monedaATexto(valor: number): string {
    return formatCurrency(valor, 'en-US', '$', 'COP', '1.0');
  }

  private readonly secretKey = 'g35*SFG842356/G56Yhg-rfs541';

  encriptarTexto(texto: string | null): string | null {
    if (!texto) return texto;

    return CryptoJS.AES.encrypt(texto, this.secretKey).toString();
  }

  desencriptarTexto(textoEncriptado: string | null): string | null {
    if (!textoEncriptado) return textoEncriptado;

    const bytes = CryptoJS.AES.decrypt(textoEncriptado, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
