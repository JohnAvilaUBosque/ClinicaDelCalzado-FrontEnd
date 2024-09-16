
import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service'
import { Router } from '@angular/router';
import { AdministradorModel } from '../administrador.model';
import { AdministradorService } from '../administrador.service';
import { Title } from '@angular/platform-browser';
import { TITLE } from 'src/app/globals';

@Component({
  selector: 'listado-admins',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-admins.component.html',
  styleUrl: './listado-admins.component.scss'
})
export class ListadoAdminsComponent implements OnInit {

  private administradorService = inject(AdministradorService);
  private titleService = inject(Title);
  private router = inject(Router);

  public constService = inject(ConstantsService);

  public administradores: AdministradorModel[] = [];

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.TITLE + ' - ' + 'Administradores');

    this.administradorService.obtenerAdministradores().subscribe(data => {
      this.administradores = data;
    })
  }

  verAdministrador(administrador: AdministradorModel) {
    this.router.navigate(['admins/ver/' + administrador.identification]);
  }

  editarAdministrador(administrador: AdministradorModel) {
    this.router.navigate(['admins/editar/' + administrador.identification]);
  }
}
