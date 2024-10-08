import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ClienteModel } from '../cliente.model';
import { BadgeModule, FormModule, TableModule, TooltipModule } from '@coreui/angular';
import { ClienteService } from '../cliente.service';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'listado-clientes',
  standalone: true,
  imports: [TableModule, FormsModule, FormModule, BadgeModule, TooltipModule, IconDirective],
  templateUrl: './listado-clientes.component.html',
  styleUrl: './listado-clientes.component.scss'
})
export class ListadoClientesComponent implements OnInit {

  private ordenDeTrabajoService = inject(ClienteService);

  public constService = inject(ConstantsService);

  clientes: ClienteModel[] = [];
  filtro: ClienteModel = new ClienteModel();
  clientesFiltrados: ClienteModel[] = [];

  @Output() seleccionClienteEvent = new EventEmitter<ClienteModel>();

  ngOnInit(): void {
    this.ordenDeTrabajoService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    })
  }

  filtrar() {
    this.clientesFiltrados = this.clientes.filter(x =>
      x.identificacion.toLowerCase().includes(this.filtro.identificacion.toLowerCase()) &&
      x.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase()) &&
      x.celular.toLowerCase().includes(this.filtro.celular.toLowerCase())
    )
  }

  seleccionarCliente(cliente: ClienteModel) {
    this.seleccionClienteEvent.emit(cliente);
  }
}
