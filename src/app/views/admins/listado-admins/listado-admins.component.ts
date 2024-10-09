
import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { RouterModule } from '@angular/router';
import { AdministradorModel } from '../administrador.model';
import { AdministradorService } from '../administrador.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'listado-admins',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, RouterModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-admins.component.html',
  styleUrl: './listado-admins.component.scss'
})
export class ListadoAdminsComponent implements OnInit {

  private administradorService = inject(AdministradorService);
  private titleService = inject(Title);

  public CONST = inject(ConstantsService);

  public administradores: AdministradorModel[] = [];

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Administradores');

    this.administradorService.obtenerAdministradores().subscribe(data => {
      this.administradores = data;
    });
  }
}
