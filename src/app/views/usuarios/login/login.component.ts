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
  
  public constService = inject(ConstantsService);

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
