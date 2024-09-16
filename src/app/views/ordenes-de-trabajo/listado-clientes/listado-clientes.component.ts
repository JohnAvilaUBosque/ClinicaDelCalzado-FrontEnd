import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ClienteModel } from '../client.model';
import { FormModule, TableModule } from '@coreui/angular';
import { ClienteService } from '../cliente.service';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'listado-clientes',
  standalone: true,
  imports: [TableModule, FormsModule, FormModule],
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
      this.clientesFiltrados = data;
    })
  }

  filtrar() {
    this.clientesFiltrados = this.clientes.filter(x =>
      x.identification.toLowerCase().includes(this.filtro.identification.toLowerCase()) &&
      x.name.toLowerCase().includes(this.filtro.name.toLowerCase()) &&
      x.cellphone.toLowerCase().includes(this.filtro.cellphone.toLowerCase())
    )
  }

  seleccionarCliente(cliente: ClienteModel) {
    this.seleccionClienteEvent.emit(cliente);
  }
}
