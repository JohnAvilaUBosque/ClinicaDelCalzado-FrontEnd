import { Component, inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { GridModule, FormModule, CardModule, ButtonModule, ToastModule, ToastComponent } from '@coreui/angular';
import { Router } from '@angular/router';
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
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, ToastModule, IconDirective]
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private titleService = inject(Title);

  public constService = inject(ConstantsService);
  public usuarioService = inject(UsuarioService);
  public administradorService = inject(AdministradorService);

  usuario: UsuarioModel = new UsuarioModel();

  @ViewChild("toast") toast!: ToastComponent;

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + 'Login');
  }

  onSubmit() {
    // this.usuarioService.iniciarSesion(this.usuario);

    this.administradorService.obtenerAdministradores().subscribe(data => {
      var admin = data.find(admin => admin.identificacion == this.usuario.identificacion);
      if (admin) {
        this.usuarioService.cambiarAdminLocal(admin);
        this.router.navigate(['ordenesdetrabajo/listado']);
      } else {
        this.toggleToast();
      }
    });
  }

  toggleToast() {
    this.toast.visible = true;
  }
}
