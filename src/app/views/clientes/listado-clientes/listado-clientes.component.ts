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

  private clienteService = inject(ClienteService);

  public CONST = inject(ConstantsService);

  clientes: ClienteModel[] = [];
  filtro: ClienteModel = new ClienteModel();
  clientesFiltrados: ClienteModel[] = [];

  @Output() seleccionClienteEvent = new EventEmitter<ClienteModel>();

  ngOnInit(): void {
    this.clienteService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    })
  }

  filtrar() {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.identificacion.toLowerCase().includes(this.filtro.identificacion.toLowerCase()) &&
      cliente.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase()) &&
      cliente.celular.toLowerCase().includes(this.filtro.celular.toLowerCase())
    )
  }

  seleccionarCliente(cliente: ClienteModel) {
    this.seleccionClienteEvent.emit(cliente);
  }
}
