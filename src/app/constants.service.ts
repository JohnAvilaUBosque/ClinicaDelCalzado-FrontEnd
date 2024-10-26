import { Injectable } from '@angular/core';
import { FORMATS_VIEW, FORMATS_API, API_URL, ORDEN_NUMBER_DEFAULT, REGULAR_EXP, ESTADO_PAGO, ESTADO_SERVICIO, ESTADO_ORDEN, ESTADO_ADMIN, ROL_ADMIN, NOMBRE_EMPRESA, WHATSAPP_URL, ESTADO_OPERARIO, CANT_FILAS_POR_PAGINA, FORMATS_ANGULAR } from './globals'
import { formatCurrency, formatDate } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subject } from 'rxjs';

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

  public readonly FORMATS_API = FORMATS_API;
  public readonly FORMATS_ANGULAR = FORMATS_ANGULAR;
  public readonly FORMATS_VIEW = FORMATS_VIEW;
  public readonly REGULAR_EXP = new REGULAR_EXP();

  private mensajeErrorEvento = new Subject<string>();
  public mensajeErrorEvento$ = this.mensajeErrorEvento.asObservable();

  private mensajeExitosoEvento = new Subject<string>();
  public mensajeExitosoEvento$ = this.mensajeExitosoEvento.asObservable();

  private cargandoEvento = new Subject<boolean>();
  public cargandoEvento$ = this.cargandoEvento.asObservable();

  public monedaATexto(valor: number): string {
    return formatCurrency(valor, 'en-US', '$', 'COP', '1.0');
  }

  public textoAFecha(texto: string | number): Date | null {
    var fecha = this.fechaATexto(texto, this.FORMATS_ANGULAR.DATE);

    if (!fecha) return null;

    return new Date(fecha);
  }

  public fechaATexto(fecha: string | number | Date, formato: string): string {
    if (typeof fecha == 'string' && fecha.indexOf('-') == 2)
      fecha = this.convertirAFechaValida(fecha);

    return formatDate(fecha, formato, 'en-US');
  }

  // dd-MM-yyyy HH:mm   =>    Date
  private convertirAFechaValida(fecha: string): Date {
    const partes = fecha.split(' ');
    const fechaPartes = partes[0].split('-');
    const nuevaFecha = new Date(
      +fechaPartes[2],     // Año
      +fechaPartes[1] - 1, // Mes (0-indexado)
      +fechaPartes[0],     // Día
      ...(partes[1] ? partes[1].split(':').map(Number) : []) // Horas y minutos
    );

    return nuevaFecha;
  }

  private readonly secretKey = 'g35*SFG842356/G56Yhg-rfs541';

  public encriptarTexto(texto: string | null): string | null {
    if (!texto) return texto;

    return CryptoJS.AES.encrypt(texto, this.secretKey).toString();
  }

  public desencriptarTexto(textoEncriptado: string | null): string | null {
    if (!textoEncriptado) return textoEncriptado;

    const bytes = CryptoJS.AES.decrypt(textoEncriptado, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public validarValorEnumerador(valor: string, enumerador: any): boolean {
    return Object.values(enumerador).includes(valor);
  }

  public duplicarObjeto(objeto: any): any {
    return JSON.parse(JSON.stringify(objeto));
  }

  public descargarElementoHtmlToPdf(elemento: HTMLElement, nombrePDF: string): void {
    html2canvas(elemento).then(canvas => {
      const imgWidth = 180;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const marginLeft = 15;
      const marginTop = 15;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
      pdf.save(nombrePDF);
    });
  }

  public descargarPDF(pdfUrl: string) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'documento.pdf';
    link.click();
  }

  public mostrarMensajeError(error: string) {
    this.mensajeErrorEvento.next(error);
  }

  public mostrarMensajeExitoso(error: string) {
    this.mensajeExitosoEvento.next(error);
  }

  public mostrarCargando() {
    this.cargandoEvento.next(true);
  }

  public ocultarCargando() {
    this.cargandoEvento.next(false);
  }

  public generarClaveAleatoria(): string {
    const letrasMayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const caracteresEspeciales = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    const letraMayuscula = letrasMayusculas.charAt(Math.floor(Math.random() * letrasMayusculas.length));

    let letrasMin = "";
    for (let i = 0; i < 3; i++) {
      letrasMin += letrasMinusculas.charAt(Math.floor(Math.random() * letrasMinusculas.length));
    }

    let nums = "";
    for (let i = 0; i < 3; i++) {
      nums += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }

    const caracterEspecial = caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));

    const contraseña = letraMayuscula + letrasMin + nums + caracterEspecial;
    return contraseña;
  }
}
