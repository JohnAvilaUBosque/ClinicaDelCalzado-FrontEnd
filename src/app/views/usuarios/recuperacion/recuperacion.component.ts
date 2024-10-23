import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { UsuarioService } from '../usuario.service';
import { RecuperacionModel } from '../usuario.model';
import { DatosSeguridadComponent } from '../datos-seguridad/datos-seguridad.component';
import { ConstantsService } from 'src/app/constants.service';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'recuperacion',
  standalone: true,
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, RouterModule, IconDirective, DatosSeguridadComponent],
  templateUrl: './recuperacion.component.html',
  styleUrl: './recuperacion.component.scss'
})
export class RecuperacionComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private router = inject(Router);

  public CONST = inject(ConstantsService);

  public recuperacion: RecuperacionModel = new RecuperacionModel();
  public lasClavesCoinciden: boolean = false;
  public sonValidosDatosSeguridad: boolean = false;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Recuperacion');
  }

  recuperarClave() {
    this.CONST.mostrarCargando();

    this.usuarioService.recuperarClave(this.recuperacion).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
        this.router.navigate(['login']);
      }
    );
  }

  confirmarClave() {
    this.lasClavesCoinciden = this.recuperacion.claveNueva == this.recuperacion.claveConfirmacion;
  }
}