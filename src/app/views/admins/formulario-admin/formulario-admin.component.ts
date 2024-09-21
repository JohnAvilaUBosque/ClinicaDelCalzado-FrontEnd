import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonGroupComponent, ButtonModule, CardModule, FormCheckLabelDirective, FormModule, GridModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AdministradorService } from '../administrador.service';
import { AdministradorModel } from '../administrador.model';
import { PreguntaService } from '../../usuarios/pregunta.service';
import { PreguntaModel } from '../../usuarios/pregunta.model';
import { FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';
import { UsuarioService } from '../../usuarios/usuario.service';

@Component({
  selector: 'formulario-admin',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonGroupComponent, IconDirective, BadgeComponent, FormCheckLabelDirective],
  templateUrl: './formulario-admin.component.html',
  styleUrl: './formulario-admin.component.scss'
})
export class FormularioAdminComponent implements OnInit {

  private administradorService = inject(AdministradorService);
  private preguntaService = inject(PreguntaService);
  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public constService = inject(ConstantsService);

  public admin: AdministradorModel = new AdministradorModel();
  public esSoloLectura: boolean = false;
  public esModoEdicion: boolean = false;
  public titulo: string = '';
  public lasClavesCoinciden: boolean = false;
  public idUsuarioLocal: string = '';
  public preguntas: Array<PreguntaModel> = [];

  ngOnInit(): void {
    this.idUsuarioLocal = this.usuarioService.obtenerUsuarioLocal()?.id;

    this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.constService.TITLE + ' - ' + title + ' administrador');

        this.titulo = title;
        if (title == 'Agregar') {
          this.admin.status = this.constService.ESTADO_ADMIN.ACTIVO;
        }
        else if (title == 'Editar') {
          this.habilitarModoEdicion();
          this.obtenerAdmin();
        }
        else if (title == 'Ver') {
          this.habilitarModoVer();
          this.obtenerAdmin();
        }
      }
    );

    this.preguntaService.obtenerPreguntas().subscribe(data => {
      this.preguntas = data;
    })
  }

  private obtenerAdmin() {
    this.route.params.pipe(map((p) => p['id-admin'])).subscribe(
      idAdmin => {
        this.administradorService.obtenerAdministrador(idAdmin).subscribe(
          adminEncontrado => {
            if (adminEncontrado) {
              this.admin = adminEncontrado;
              this.btnRadioGroup.setValue({ radio: this.admin.status });
            }

            else
              this.router.navigate(['admins/listado']);
          }
        );
      }
    );
  }

  onSubmit() {
    if (this.esModoEdicion) {
      this.administradorService.editarAdministrador(this.admin);
      this.habilitarModoVer();
    } else {
      this.administradorService.crearAdministrador(this.admin);
      this.router.navigate(['admins/ver/' + '123456789']); // TO DO: Hacer esto dentro del suscribe del crear admin
    }
  }

  habilitarModoEdicion() {
    this.titulo = 'Editar';
    this.esModoEdicion = true;
    this.esSoloLectura = false;
  }

  habilitarModoVer() {
    this.titulo = 'Ver';
    this.esSoloLectura = true;
    this.esModoEdicion = false;
  }

  btnRadioGroup = this.formBuilder.group({
    radio: new FormControl(this.constService.ESTADO_ADMIN.ACTIVO.toString())
  });

  cambiarEstado(value: string): void {
    this.btnRadioGroup.setValue({ radio: value });
    this.admin.status = value;
  }

  cambiarClave(): void {
    throw new Error('Method not implemented.');
  }

  confirmarClave() {
    this.lasClavesCoinciden = this.admin.password == this.admin.passwordConfirm;
  }
}
