import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { GridModule, FormModule, CardModule, ButtonModule, ToastModule, ToastComponent, ModalModule, ModalComponent } from '@coreui/angular';
import { Router, RouterModule } from '@angular/router';
import { CambioDeClaveModel, UsuarioModel } from '../usuario.model';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';
import { UsuarioService } from '../usuario.service';
import { AdministradorService } from '../../admins/administrador.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, ToastModule, RouterModule, ModalModule, IconDirective]
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private titleService = inject(Title);

  private adminService = inject(AdministradorService);
  private usuarioService = inject(UsuarioService);

  public CONST = inject(ConstantsService);

  public usuario: UsuarioModel = new UsuarioModel();

  public cambioDeClave: CambioDeClaveModel = new CambioDeClaveModel();
  public lasClavesCoinciden: boolean = false;

  public mensajeError: string = '';

  @ViewChild('toastError') toastError!: ToastComponent;
  @ViewChild('cambiarClaveModal') cambiarClaveModal!: ModalComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Login');
  }

  iniciarSesion() {
    this.toastError.visible = false;

    this.usuarioService.iniciarSesion(this.usuario).subscribe(
      respuesta => {
        if (respuesta.error) {
          this.mensajeError = respuesta.message || 'Credenciales inválidas';
          this.toastError.visible = true;
          return;
        }

        if (respuesta.access_token) {
          this.usuarioService.cambiarToken(respuesta.access_token);
          this.obtenerAdmin();
        }
      });
  }

  private obtenerAdmin() {
    this.toastError.visible = false;

    this.adminService.obtenerAdministrador(this.usuario.identificacion).subscribe(
      admin => {
        if (admin) this.usuarioService.cambiarAdminLocal(admin);
        
        if (admin && admin.tieneClaveTemporal) {
          this.cambiarClaveModal.visible = true;
          return;
        }

        this.router.navigate(['ordenesdetrabajo/listado']);
      });
  }

  cambiarClave(): void {
    this.cambioDeClave.identificacion = this.usuario.identificacion;

    this.adminService.cambiarClave(this.cambioDeClave).subscribe(
      respuesta => {
        this.cambiarClaveModal.visible = false;
        this.cambioDeClave = new CambioDeClaveModel();
        this.lasClavesCoinciden = false;

        this.router.navigate(['ordenesdetrabajo/listado']);
      }
    );
  }

  confirmarClave() {
    this.lasClavesCoinciden = this.cambioDeClave.claveNueva == this.cambioDeClave.claveConfirmacion;
  }

}
