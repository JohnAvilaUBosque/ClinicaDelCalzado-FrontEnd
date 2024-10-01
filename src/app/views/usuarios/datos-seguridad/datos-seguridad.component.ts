import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CardModule, FormModule, GridModule } from '@coreui/angular';
import { DatosSeguridadModel } from '../usuario.model';
import { PreguntaModel } from '../pregunta.model';
import { PreguntaService } from '../pregunta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'datos-seguridad',
  standalone: true,
  imports: [CommonModule, GridModule, CardModule, FormModule, FormsModule],
  templateUrl: './datos-seguridad.component.html',
  styleUrl: './datos-seguridad.component.scss'
})
export class DatosSeguridadComponent implements OnInit, AfterViewInit {

  private preguntaService = inject(PreguntaService);

  @Input() datosSeguridad: DatosSeguridadModel = new DatosSeguridadModel;

  public preguntas: Array<PreguntaModel> = [];

  @ViewChild('datosSeguridadForm') form?: NgForm;

  @Output() esFormularioValido = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.preguntaService.obtenerPreguntas().subscribe(data => {
      this.preguntas = data;
    });
  }

  ngAfterViewInit() {
    if (this.form)
      this.form.statusChanges?.subscribe(status => {
        this.esFormularioValido.emit(status === 'VALID');
      });
  }
}
