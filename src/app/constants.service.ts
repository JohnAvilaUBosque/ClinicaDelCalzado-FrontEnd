import { Injectable } from '@angular/core';
import { FORMATS_VIEW, FORMATS_API, API_URL, ORDEN_NUMBER_DEFAULT, REGULAR_EXP, ESTADO_PAGO, ESTADO_SERVICIO, ESTADO_ORDEN, ESTADO_ADMIN, ROL_ADMIN, TITLE, WHATSAPP_URL } from './globals'

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  
  public readonly TITLE = TITLE;
  public readonly ORDEN_NUMBER_DEFAULT = ORDEN_NUMBER_DEFAULT;
  
  public readonly WHATSAPP_URL = WHATSAPP_URL;
  public readonly API_URL = API_URL;

  public readonly FORMATS_VIEW = FORMATS_VIEW;
  public readonly FORMATS_API = FORMATS_API;

  public readonly REGULAR_EXP = new REGULAR_EXP();

  public readonly ESTADO_ORDEN = ESTADO_ORDEN;
  public readonly ESTADO_PAGO = ESTADO_PAGO;
  public readonly ESTADO_SERVICIO = ESTADO_SERVICIO;
  public readonly ESTADO_ADMIN = ESTADO_ADMIN;

  public readonly ROL_ADMIN = ROL_ADMIN;

}
