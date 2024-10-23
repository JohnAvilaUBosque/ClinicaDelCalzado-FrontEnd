import { Injectable } from '@angular/core';
import { PreguntaModel } from './pregunta.model';
import { catchError, map, Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { RespuestaModel } from 'src/app/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService extends BaseService {

  private readonly URL: string = this.CONST.API_URL + '/api/v1/questions';

  public obtenerPreguntas(): Observable<RespuestaModel<PreguntaModel[]>> {
    return this.http.get<any>(this.URL + '/list').pipe(map(
      respuesta => {
        var respuestaMapeada = this.validarRespuesta<PreguntaModel[]>(respuesta);
        if (respuestaMapeada.esError) return respuestaMapeada;

        respuestaMapeada.objeto = this.mapearAPreguntas(respuesta.questions);
        return respuestaMapeada;
      }
    )).pipe(catchError((error) => this.controlarError(error)));
  }

  private mapearAPreguntas(preguntas: any[]): PreguntaModel[] {
    return preguntas.map(
      pregunta => {
        return this.mapearAPregunta(pregunta);
      });
  }

  private mapearAPregunta(pregunta: any): PreguntaModel {
    return {
      id: pregunta.id_question,
      descripcion: pregunta.question
    };
  }

}
