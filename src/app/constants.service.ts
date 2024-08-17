import { Injectable } from '@angular/core';
import { FORMATS_VIEW, FORMATS_API, API_URL, ORDEN_NUMBER_DEFAULT } from './globals'

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public readonly API_URL = API_URL;
  public readonly ORDEN_NUMBER_DEFAULT = ORDEN_NUMBER_DEFAULT;
  
  public readonly FORMATS_VIEW = FORMATS_VIEW;
  public readonly FORMATS_API = FORMATS_API;
}
