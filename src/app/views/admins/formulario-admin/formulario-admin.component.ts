import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonGroupComponent, ButtonModule, CardModule, FormCheckLabelDirective, FormModule, GridModule, ModalComponent, ModalModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AdministradorService } from '../administrador.service';
import { AdministradorModel } from '../administrador.model';
import { FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';
import { UsuarioService } from '../../usuarios/usuario.service';
import { CambioDeClaveModel, DatosSeguridadModel } from '../../usuarios/usuario.model';
import { DatosSeguridadComponent } from '../../usuarios/datos-seguridad/datos-seguridad.component';

@Component({
  selector: 'formulario-admin',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ReactiveFormsModule, ModalModule, RouterModule, ButtonGroupComponent, IconDirective, BadgeComponent, FormCheckLabelDirective, DatosSeguridadComponent],
  templateUrl: './formulario-admin.component.html',
  styleUrl: './formulario-admin.component.scss'
})
export class FormularioAdminComponent implements OnInit {

  private administradorService = inject(AdministradorService);
  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public titulo: string = '';
  public adminLocal: AdministradorModel = new AdministradorModel();

  public esModoCreacion: boolean = false;
  public esModoEdicion: boolean = false;
  public esModoLectura: boolean = false;
  public esInformacionPersonal: boolean = false;

  public admin: AdministradorModel = new AdministradorModel();
  public lasClavesCoinciden: boolean = false;
  public editarDatosSeguridad: boolean = false;
  public sonValidosDatosSeguridad: boolean = false;

  public cambioDeClave: CambioDeClaveModel = new CambioDeClaveModel();

  private formBuilder = inject(FormBuilder);
  public btnRadioGroup = this.formBuilder.group({
    radioEstado: new FormControl('')
  });

  ngOnInit(): void {
    this.adminLocal = this.usuarioService.obtenerAdminLocal();

    this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + title + ' administrador');

        this.titulo = title;
        if (title == 'Agregar') {
          this.admin.estado = this.CONST.ESTADO_ADMIN.ACTIVO;
          this.btnRadioGroup.setValue({ radioEstado: this.admin.estado });
          this.btnRadioGroup.disable();
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
              this.admin.datosSeguridad = new DatosSeguridadModel;
              this.esInformacionPersonal = this.adminLocal.identificacion == this.admin.identificacion;

              this.btnRadioGroup.setValue({ radioEstado: this.admin.estado });
              if (this.esModoCreacion || this.esModoLectura || (this.esModoEdicion && (this.esInformacionPersonal || this.adminLocal.rol == this.CONST.ROL_ADMIN.SECUNDARIO))) {
                this.btnRadioGroup.disable();
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
      this.administradorService.editarAdministrador(this.admin).subscribe(
        respuesta => {
          this.router.navigate(['admins/ver/' + this.admin.identificacion]);
        }
      );
    } else {
      this.administradorService.crearAdministrador(this.admin).subscribe(
        respuesta => {
          this.router.navigate(['admins/ver/' + this.admin.identificacion]);
        }
      );
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
    this.admin.estado = value;
  }

  confirmarClave() {
    this.lasClavesCoinciden = this.admin.clave == this.admin.claveConfirmacion;
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
