import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClienteModel } from './client.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/clientes.json';

  obtenerClientes(): Observable<ClienteModel[]> {
    return this.http.get<any>(this.url).pipe(map(x => x['clients']));
  }

}
