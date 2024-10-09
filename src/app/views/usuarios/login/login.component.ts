import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { GridModule, FormModule, CardModule, ButtonModule, ToastModule, ToastComponent } from '@coreui/angular';
import { Router, RouterModule } from '@angular/router';
import { UsuarioModel } from '../usuario.model';
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
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, ToastModule, RouterModule, IconDirective]
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private titleService = inject(Title);

  private usuarioService = inject(UsuarioService);
  private administradorService = inject(AdministradorService);

  public CONST = inject(ConstantsService);

  usuario: UsuarioModel = new UsuarioModel();

  @ViewChild('toastCredencialesIncorrectas') toastCredencialesIncorrectas!: ToastComponent;
  @ViewChild('toastUsuarioInactivo') toastUsuarioInactivo!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Login');
  }

  iniciarSesion() {
    this.toastCredencialesIncorrectas.visible = false;
    this.toastUsuarioInactivo.visible = false;

    // this.usuarioService.iniciarSesion(this.usuario);
    if (this.usuario.clave.length < 8) {
      this.toastCredencialesIncorrectas.visible = true;
      return;
    }

    this.administradorService.obtenerAdministradores().subscribe(data => {
      var admin = data.find(admin => admin.identificacion == this.usuario.identificacion);
      if (!admin) {
        this.toastCredencialesIncorrectas.visible = true;
        return;
      }

      if (admin.estado == this.CONST.ESTADO_ADMIN.INACTIVO) {
        this.toastUsuarioInactivo.visible = true;
        return;
      }

      this.usuarioService.cambiarAdminLocal(admin);
      this.router.navigate(['ordenesdetrabajo/listado']);
    });
  }

}
