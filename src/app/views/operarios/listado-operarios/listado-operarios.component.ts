import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { OperarioModel } from '../operario.model';
import { BadgeModule, ButtonModule, CardModule, FormModule, TableModule, TooltipModule } from '@coreui/angular';
import { OperarioService } from '../operario.service';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'listado-operarios',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, FormModule, BadgeModule, TooltipModule, CardModule, RouterModule, ButtonModule, IconDirective],
  templateUrl: './listado-operarios.component.html',
  styleUrl: './listado-operarios.component.scss'
})
export class ListadoOperariosComponent {

  private operarioService = inject(OperarioService);

  public CONST = inject(ConstantsService);

  @Input() esEmbebido: boolean = false;

  operarios: OperarioModel[] = [];
  filtro: OperarioModel = new OperarioModel();
  operariosFiltrados: OperarioModel[] = [];

  @Output() seleccionOperarioEvent = new EventEmitter<OperarioModel>();

  ngOnInit(): void {
    this.operarioService.obtenerOperarios().subscribe(data => {
      this.operarios = data;
      if (!this.esEmbebido)
        this.operariosFiltrados = data;
    })
  }

  filtrar() {
    if (this.esEmbebido && !this.filtro.identificacion && !this.filtro.nombre && !this.filtro.celular) {
      this.operariosFiltrados = [];
      return;
    }

    this.operariosFiltrados = this.operarios.filter(operario =>
      operario.identificacion.toLowerCase().includes(this.filtro.identificacion.toLowerCase()) &&
      operario.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase()) &&
      operario.celular.toLowerCase().includes(this.filtro.celular.toLowerCase()) &&
      (!this.filtro.estado || operario.estado.toLowerCase() == this.filtro.estado.toLowerCase())
    )
  }

  seleccionarOperario(operario: OperarioModel) {
    this.seleccionOperarioEvent.emit(operario);
  }
}
