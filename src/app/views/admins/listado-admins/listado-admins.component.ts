
import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule, GridModule } from '@coreui/angular';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service';
import { Router, RouterModule } from '@angular/router';
import { AdministradorModel } from '../administrador.model';
import { AdministradorService } from '../administrador.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'listado-admins',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, GridModule, BadgeModule, ButtonModule, TooltipModule, RouterModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-admins.component.html',
  styleUrl: './listado-admins.component.scss'
})
export class ListadoAdminsComponent implements OnInit {

  private administradorService = inject(AdministradorService);
  private titleService = inject(Title);
  private router = inject(Router);

  public CONST = inject(ConstantsService);

  public administradores: AdministradorModel[] = [];

  public adminLocal: AdministradorModel = new AdministradorModel();

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Administradores');

    this.adminLocal = this.administradorService.obtenerAdminLocal();

    this.obtenerAdmins();
  }

  obtenerAdmins() {
    this.CONST.mostrarCargando();

    this.administradorService.obtenerAdmins().subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.administradores = respuesta.objeto;
        this.CONST.ocultarCargando();
      });
  }

  navegarAVerAdmin(idAdmin: string) {
    if (this.adminLocal.identificacion == idAdmin)
      this.router.navigate(['admins/perfil']);
    else
      this.router.navigate(['admins/ver/' + idAdmin]);
  }

  navegarAEditarAdmin(idAdmin: string) {
    this.router.navigate(['admins/editar/' + idAdmin]);
  }
}
