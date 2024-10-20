import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AlertModule, BadgeComponent, ButtonGroupComponent, ButtonModule, CardModule, FormCheckLabelDirective, FormModule, GridModule, ModalComponent, ModalModule, TooltipModule } from '@coreui/angular';
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
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ReactiveFormsModule, ModalModule, RouterModule, AlertModule, ButtonGroupComponent, IconDirective, BadgeComponent, FormCheckLabelDirective, DatosSeguridadComponent],
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

  public admin: AdministradorModel = new AdministradorModel();
  public lasClavesCoinciden: boolean = false;

  public asignarClaveTemporal: boolean = false;
  public claveTemporal: string = '';

  public esInformacionPersonal: boolean = false;
  public editarDatosSeguridad: boolean = false;
  public sonValidosDatosSeguridad: boolean = false;

  public cambioDeClave: CambioDeClaveModel = new CambioDeClaveModel();

  private formBuilder = inject(FormBuilder);
  public btnRadioGroup = this.formBuilder.group({
    radioEstado: new FormControl('')
  });

  @ViewChild('claveTemporalModal') claveTemporalModal!: ModalComponent;

  ngOnInit(): void {
    this.adminLocal = this.usuarioService.obtenerAdminLocal();

    this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + title + ' administrador');

        this.titulo = title;
        if (title == 'Agregar') {
          this.esModoCreacion = true;
          this.cambiarEstado(this.CONST.ESTADO_ADMIN.ACTIVO);
          this.btnRadioGroup.disable();
        }
        else if (title == 'Editar') {
          this.esModoEdicion = true;
          this.obtenerAdmin();
        }
        else if (title == 'Ver') {
          this.esModoLectura = true;
          this.obtenerAdmin();
        }
        else if (title == 'Perfil') {
          this.titulo = 'Ver';
          this.esModoLectura = true;
          this.esInformacionPersonal = true;

          this.admin = this.adminLocal;
          this.admin.datosSeguridad = new DatosSeguridadModel;
          this.cambiarEstado(this.admin.estado);
          this.btnRadioGroup.disable();
        }
      }
    );
  }

  private obtenerAdmin() {
    this.route.params.pipe(map((p) => p['id-admin'])).subscribe(
      idAdmin => {
        this.administradorService.obtenerAdmin(idAdmin).subscribe(
          adminEncontrado => {
            if (adminEncontrado) {
              this.admin = adminEncontrado;
              this.admin.datosSeguridad = new DatosSeguridadModel;
              this.esInformacionPersonal = this.adminLocal.identificacion == this.admin.identificacion;

              this.cambiarEstado(this.admin.estado);
              if (this.esModoLectura
                || (this.esModoEdicion && this.adminLocal.rol == this.CONST.ROL_ADMIN.SECUNDARIO)
                || this.esInformacionPersonal) {
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
      if (this.asignarClaveTemporal) this.admin.tieneClaveTemporal = this.asignarClaveTemporal;

      this.administradorService.editarAdministrador(this.admin).subscribe(
        respuesta => {
          if (this.asignarClaveTemporal) {
            this.claveTemporal = respuesta.clave;
            this.claveTemporalModal.visible = true;
            return;
          }

          this.irAVerAdmin();
        }
      );
    } else {
      this.admin.tieneClaveTemporal = true;
      this.administradorService.crearAdmin(this.admin).subscribe(
        respuesta => {
          this.irAVerAdmin();
        }
      );
    }
  }

  cambiarClave(cambiarClaveModal: ModalComponent): void {
    this.cambioDeClave.identificacion = this.admin.identificacion;

    this.administradorService.cambiarClave(this.cambioDeClave).subscribe(
      respuesta => {
        cambiarClaveModal.visible = false;
        this.cambioDeClave = new CambioDeClaveModel();
        this.lasClavesCoinciden = false;
      }
    );
  }

  irAVerAdmin() {
    this.router.navigate(['admins/ver/' + this.admin.identificacion]);
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

}
