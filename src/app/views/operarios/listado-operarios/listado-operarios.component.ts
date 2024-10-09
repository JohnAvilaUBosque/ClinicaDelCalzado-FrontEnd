import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { OperarioModel } from '../operario.model';
import { BadgeModule, FormModule, TableModule, TooltipModule } from '@coreui/angular';
import { OperarioService } from '../operario.service';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'listado-operarios',
  standalone: true,
  imports: [TableModule, FormsModule, FormModule, BadgeModule, TooltipModule, IconDirective],
  templateUrl: './listado-operarios.component.html',
  styleUrl: './listado-operarios.component.scss'
})
export class ListadoOperariosComponent {

  private operarioService = inject(OperarioService);

  public CONST = inject(ConstantsService);

  operarios: OperarioModel[] = [];
  filtro: OperarioModel = new OperarioModel();
  operariosFiltrados: OperarioModel[] = [];

  @Output() seleccionOperarioEvent = new EventEmitter<OperarioModel>();

  ngOnInit(): void {
    this.operarioService.obtenerOperarios().subscribe(data => {
      this.operarios = data;
    })
  }

  filtrar() {
    this.operariosFiltrados = this.operarios.filter(operario =>
      operario.identificacion.toLowerCase().includes(this.filtro.identificacion.toLowerCase()) &&
      operario.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase()) &&
      operario.celular.toLowerCase().includes(this.filtro.celular.toLowerCase())
    )
  }

  seleccionarOperario(operario: OperarioModel) {
    this.seleccionOperarioEvent.emit(operario);
  }
}
