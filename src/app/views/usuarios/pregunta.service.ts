import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PreguntaModel } from './pregunta.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  private http = inject(HttpClient);

  url: string = '/assets/dummy-data/preguntas.json';

  obtenerPreguntas(): Observable<PreguntaModel[]> {
    return this.http.get<any>(this.url).pipe(map(x => x['preguntas']));
  }

}
