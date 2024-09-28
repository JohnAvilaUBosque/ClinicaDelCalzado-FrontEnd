import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { UsuarioService } from '../usuario.service';
import { RecuperacionModel as RecuperacionModel } from '../usuario.model';
import { PreguntaService } from '../pregunta.service';
import { PreguntaModel } from '../pregunta.model';
import { ConstantsService } from 'src/app/constants.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recuperacion',
  standalone: true,
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, IconDirective],
  templateUrl: './recuperacion.component.html',
  styleUrl: './recuperacion.component.scss'
})
export class RecuperacionComponent implements OnInit {

  private preguntaService = inject(PreguntaService);
  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private router = inject(Router);

  public constService = inject(ConstantsService);

  public preguntas: Array<PreguntaModel> = [];

  public recuperacion: RecuperacionModel = new RecuperacionModel();
  public lasClavesCoinciden: boolean = false;

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + 'Recuperacion');

    this.preguntaService.obtenerPreguntas().subscribe(data => {
      this.preguntas = data;
    });
  }

  onSubmit() {
    // this.usuarioService.recuperarClave(this.recuperacion);

    this.router.navigate(['login']);
  }

  confirmarClave() {
    this.lasClavesCoinciden = this.recuperacion.claveNueva == this.recuperacion.claveConfirmacion;
  }

}
