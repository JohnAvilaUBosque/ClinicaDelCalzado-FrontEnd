import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { OperarioModel } from '../operario.model';
import { BadgeModule, ButtonModule, CardModule, FormModule, GridModule, PaginationModule, TableModule, TooltipModule } from '@coreui/angular';
import { OperarioService } from '../operario.service';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'listado-operarios',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, FormModule, GridModule, BadgeModule, TooltipModule, CardModule, RouterModule, ButtonModule, PaginationModule, IconDirective],
  templateUrl: './listado-operarios.component.html',
  styleUrl: './listado-operarios.component.scss'
})
export class ListadoOperariosComponent {

  private operarioService = inject(OperarioService);
  private titleService = inject(Title);

  public CONST = inject(ConstantsService);

  @Input() esEmbebido: boolean = false;

  public operarios: OperarioModel[] = [];
  public filtro: OperarioModel = new OperarioModel();
  public operariosFiltrados: OperarioModel[] = [];

  public operariosPorPagina: Array<OperarioModel[]> = [];
  public paginaActual: number = 1;

  @Output() seleccionOperarioEvent = new EventEmitter<OperarioModel>();

  ngOnInit(): void {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + 'Operarios');

    this.obtenerOperarios();
  }

  obtenerOperarios() {
    this.CONST.mostrarCargando();

    this.operarioService.obtenerOperarios().subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.operarios = respuesta.objeto;
        this.filtrar();
        
        this.CONST.ocultarCargando();
      });
  }

  filtrar() {
    this.operariosFiltrados = this.operarios.filter(operario =>
      operario.identificacion.toLowerCase().includes(this.filtro.identificacion.toLowerCase()) &&
      operario.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase()) &&
      operario.celular.toLowerCase().includes(this.filtro.celular.toLowerCase()) &&
      (!this.filtro.estado || operario.estado.toLowerCase() == this.filtro.estado.toLowerCase())
    );
    this.paginar();
  }

  paginar() {
    this.paginaActual = 1;
    this.operariosPorPagina = [];
    for (let i = 0; i < this.operariosFiltrados.length; i += this.CONST.CANT_FILAS_POR_PAGINA) {
      const operarios = this.operariosFiltrados.slice(i, i + this.CONST.CANT_FILAS_POR_PAGINA);
      this.operariosPorPagina.push(operarios);
    };
  }

  seleccionarOperario(operario: OperarioModel) {
    this.seleccionOperarioEvent.emit(operario);
  }
}
