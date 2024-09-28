import { Component, inject, OnInit } from '@angular/core';
import { TableModule, CardModule, BadgeModule, ButtonModule, TooltipModule } from '@coreui/angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service'
import { OrdenDeTrabajoModel } from '../orden-de-trabajo.model'
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ConstantsService } from '../../../constants.service'
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'listado-ordenes',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, TooltipModule, IconDirective, CurrencyPipe, UpperCasePipe],
  templateUrl: './listado-ordenes.component.html',
  styleUrl: './listado-ordenes.component.scss'
})
export class ListadoOrdenesComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private titleService = inject(Title);
  private router = inject(Router);

  public constService = inject(ConstantsService);

  public ordenes: OrdenDeTrabajoModel[] = [];

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + 'Órdenes de trabajo');

    this.ordenDeTrabajoService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data;
    })
  }

  verOrden(orden: OrdenDeTrabajoModel) {
    this.router.navigate(['ordenesdetrabajo/ver/' + orden.numeroOrden]);
  }
}
