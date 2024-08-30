import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { GridModule, FormModule, CardModule, ButtonModule } from '@coreui/angular';
import { Router } from '@angular/router';
import { UsuarioModel } from '../usuario.model';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, IconDirective]
})
export class LoginComponent {

  private router = inject(Router);

  public constService = inject(ConstantsService);

  user: UsuarioModel = new UsuarioModel();

  constructor() { }

  onSubmit() {
    this.router.navigate(['ordenesdetrabajo/listado']);
  }
}
