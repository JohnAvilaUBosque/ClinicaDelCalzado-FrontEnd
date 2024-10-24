import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ClienteModel } from '../cliente.model';
import { BadgeModule, FormModule, PaginationModule, TableModule, TooltipModule } from '@coreui/angular';
import { ClienteService } from '../cliente.service';
import { FormsModule } from '@angular/forms';
import { ConstantsService } from 'src/app/constants.service';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'listado-clientes',
  standalone: true,
  imports: [TableModule, FormsModule, FormModule, BadgeModule, TooltipModule, PaginationModule, IconDirective],
  templateUrl: './listado-clientes.component.html',
  styleUrl: './listado-clientes.component.scss'
})
export class ListadoClientesComponent implements OnInit {

  private clienteService = inject(ClienteService);

  public CONST = inject(ConstantsService);

  public clientes: ClienteModel[] = [];
  public filtro: ClienteModel = new ClienteModel();
  public clientesFiltrados: ClienteModel[] = [];

  public clientesPorPagina: Array<ClienteModel[]> = [];
  public paginaActual: number = 1;

  @Output() seleccionClienteEvent = new EventEmitter<ClienteModel>();

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.CONST.mostrarCargando();

    this.clienteService.obtenerClientes().subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.clientes = respuesta.objeto;
        this.filtrar();
        
        this.CONST.ocultarCargando();
      });
  }

  filtrar() {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.identificacion.toLowerCase().includes(this.filtro.identificacion.toLowerCase()) &&
      cliente.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase()) &&
      cliente.celular.toLowerCase().includes(this.filtro.celular.toLowerCase())
    )
    this.paginar();
  }

  paginar() {
    this.paginaActual = 1;
    this.clientesPorPagina = [];
    for (let i = 0; i < this.clientesFiltrados.length; i += this.CONST.CANT_FILAS_POR_PAGINA) {
      const clientes = this.clientesFiltrados.slice(i, i + this.CONST.CANT_FILAS_POR_PAGINA);
      this.clientesPorPagina.push(clientes);
    };
  }

  seleccionarCliente(cliente: ClienteModel) {
    this.seleccionClienteEvent.emit(cliente);
  }
}
