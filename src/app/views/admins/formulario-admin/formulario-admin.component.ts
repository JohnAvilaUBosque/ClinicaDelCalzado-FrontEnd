import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonGroupComponent, ButtonModule, CardModule, FormCheckLabelDirective, FormModule, GridModule, ModalComponent, ModalModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AdministradorService } from '../administrador.service';
import { AdministradorModel } from '../administrador.model';
import { PreguntaService } from '../../usuarios/pregunta.service';
import { PreguntaModel } from '../../usuarios/pregunta.model';
import { FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';
import { UsuarioService } from '../../usuarios/usuario.service';
import { CambioDeClaveModel, UsuarioModel } from '../../usuarios/usuario.model';

@Component({
  selector: 'formulario-admin',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ReactiveFormsModule, ModalModule, RouterModule, ButtonGroupComponent, IconDirective, BadgeComponent, FormCheckLabelDirective],
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

  public titulo: string = '';
  public adminLocal: UsuarioModel = new UsuarioModel();

  public admin: AdministradorModel = new AdministradorModel();
  public lasClavesCoinciden: boolean = false;

  public esModoCreacion: boolean = false;
  public esModoEdicion: boolean = false;
  public esModoLectura: boolean = false;

  public editarDatosSeguridad: boolean = false;
  public preguntas: Array<PreguntaModel> = [];

  public cambioDeClave: CambioDeClaveModel = new CambioDeClaveModel();

  btnRadioGroup = this.formBuilder.group({
    radioEstado: new FormControl("")
  });

  ngOnInit(): void {
    this.adminLocal = this.usuarioService.obtenerUsuarioLocal();

    this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.constService.TITLE + ' - ' + title + ' administrador');

        this.titulo = title;
        if (title == 'Agregar') {
          this.admin.status = this.constService.ESTADO_ADMIN.ACTIVO;
          this.btnRadioGroup.setValue({ radioEstado: this.admin.status });
          this.habilitarModoCreacion();
        }
        else if (title == 'Editar') {
          this.obtenerAdmin();
          this.habilitarModoEdicion();
        }
        else if (title == 'Ver') {
          this.obtenerAdmin();
          this.habilitarModoLectura();
        }
      }
    );

  }

  private obtenerAdmin() {
    this.route.params.pipe(map((p) => p['id-admin'])).subscribe(
      idAdmin => {
        this.administradorService.obtenerAdministrador(idAdmin).subscribe(
          adminEncontrado => {
            if (adminEncontrado) {
              this.admin = adminEncontrado;
              this.btnRadioGroup.setValue({ radioEstado: this.admin.status });

              if (this.esModoEdicion && this.adminLocal.id == this.admin.identification) {
                this.preguntaService.obtenerPreguntas().subscribe(data => {
                  this.preguntas = data;
                })
              }
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
      this.router.navigate(['admins/ver/' + this.admin.identification]);
    } else {
      this.administradorService.crearAdministrador(this.admin);
      this.router.navigate(['admins/ver/' + '123456789']); // TO DO: Hacer esto dentro del suscribe del crear admin
    }
  }

  habilitarModoCreacion() {
    this.esModoCreacion = true;
    this.esModoEdicion = false;
    this.esModoLectura = false;
  }

  habilitarModoEdicion() {
    this.esModoCreacion = false;
    this.esModoEdicion = true;
    this.esModoLectura = false;
  }

  habilitarModoLectura() {
    this.esModoCreacion = false;
    this.esModoEdicion = false;
    this.esModoLectura = true;
  }

  cambiarEstado(value: string): void {
    this.btnRadioGroup.setValue({ radioEstado: value });
    this.admin.status = value;
  }

  confirmarClave() {
    this.lasClavesCoinciden = this.admin.password == this.admin.passwordConfirm;
  }

  confirmarClaveEnCambioDeClave() {
    this.lasClavesCoinciden = this.cambioDeClave.claveNueva == this.cambioDeClave.claveConfirmacion;
  }

  cambiarClave(cambiarClaveModal: ModalComponent): void {
    console.log(this.cambioDeClave);

    this.cambioDeClave = new CambioDeClaveModel();
    this.lasClavesCoinciden = false;

    cambiarClaveModal.visible = false;
  }
}
