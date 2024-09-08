import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { GridModule, FormModule, CardModule, ButtonModule } from '@coreui/angular';
import { Router } from '@angular/router';
import { UsuarioModel } from '../usuario.model';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, GridModule, FormModule, FormsModule, CardModule, ButtonModule, IconDirective]
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private titleService = inject(Title);

  public constService = inject(ConstantsService);

  user: UsuarioModel = new UsuarioModel();


  ngOnInit(): void {
    this.titleService.setTitle(this.constService.TITLE + ' - ' + 'Login');
  }

  onSubmit() {
    this.router.navigate(['ordenesdetrabajo/listado']);
  }
}
