import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { BadgeComponent, ButtonModule, CardModule, FormModule, GridModule, ModalComponent, ModalModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service';
import { OrdenDeTrabajoModel, ComentarioModel } from '../orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, min } from 'rxjs';
import { UsuarioService } from '../../usuarios/usuario.service';
import { ConstantsService } from 'src/app/constants.service';
import { ListadoServiciosComponent } from '../../servicios/listado-servicios/listado-servicios.component';
import { ListadoClientesComponent } from '../../clientes/listado-clientes/listado-clientes.component';
import { ListadoOperariosComponent } from '../../operarios/listado-operarios/listado-operarios.component';
import { Title } from '@angular/platform-browser';
import { ClienteModel } from '../../clientes/cliente.model';
import { ServicioModel } from '../../servicios/servicio.model';
import { AdministradorModel } from '../../admins/administrador.model';
import { AdministradorService } from '../../admins/administrador.service';

@Component({
  selector: 'formulario-orden',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ModalModule, IconDirective, BadgeComponent, ListadoServiciosComponent, ListadoClientesComponent, ListadoOperariosComponent],
  templateUrl: './formulario-orden.component.html',
  styleUrl: './formulario-orden.component.scss'
})
export class FormularioOrdenComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private adminService = inject(AdministradorService);
  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public esModoCreacion: boolean = false;
  public esModoLectura: boolean = false;
  public esModoMigracion: boolean = false;

  public orden: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public sonValidosServicios: boolean = false;
  public esValidaFechaEntrega: boolean = false;

  public administradores: AdministradorModel[] = [];
  public fechaCreacion: string = '';
  public horaCreacion: string = '';
  public amOpm: string = '';
  public esValidaFechaCreacion: boolean = false;

  public whatsAppNumber: string = '';
  public abonoNuevo: number = 0;
  public saldoNuevo: number = 0;
  public comentarioNuevo: string = '';
  public comentarioAnulacion: string = '';

  public usuarioLocal: AdministradorModel = new AdministradorModel();

  @ViewChild('elementoADescargar') elementoADescargar!: ElementRef;

  ngOnInit(): void {
    this.usuarioLocal = this.usuarioService.obtenerAdminLocal();

    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + title + ' orden de trabajo');

        if (title == 'Crear') {
          this.esModoCreacion = true;
          this.orden.numeroOrden = this.CONST.ORDEN_NUMBER_DEFAULT;
          this.orden.atendidoPor = this.usuarioLocal.nombre;
          this.orden.fechaCreacion = this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_API.DATETIME);
          this.orden.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
        }
        else if (title == 'Migrar') {
          this.esModoMigracion = true;
          this.orden.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
          this.obtenerAdministradores();
        }
        else if (title == 'Ver') {
          this.esModoLectura = true;
          this.route.params.pipe(map((p) => p['numero-orden'])).subscribe(
            numeroOrden => {
              this.obtenerOrden(numeroOrden);
            }
          );
        }
      }
    );
  }

  obtenerAdministradores() {
    this.adminService.obtenerAdministradores().subscribe(admins => this.administradores = admins);
  }

  obtenerOrden(numeroOrden: string, funcion?: Function) {
    this.ordenDeTrabajoService.obtenerOrden(numeroOrden).subscribe(
      ordenEncontrada => {
        if (ordenEncontrada) {
          this.orden = ordenEncontrada;
          this.whatsAppNumber = ordenEncontrada.cliente.celular;
          if (funcion) funcion();
        }
        else
          this.router.navigate(['ordenesdetrabajo/buscar/'], { queryParams: { ordenNoEncontrada: numeroOrden } });
      }
    );
  }

  ngSubmit() {
    if (this.esModoCreacion)
      this.crearOrden();
    else
      this.migrarOrden();
  }

  crearOrden() {
    this.orden.fechaCreacion = this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_API.DATETIME);
    this.orden.fechaEntrega = this.CONST.fechaATexto(this.orden.fechaEntrega, this.CONST.FORMATS_API.DATE);
    this.orden.estadoPago = this.orden.saldo != 0 ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.orden.servicios.some(s => s.precio == 0) ?
        this.CONST.ESTADO_PAGO.PENDIENTE :
        this.CONST.ESTADO_PAGO.PAGADO;

    if (this.comentarioNuevo)
      this.agregarComentarioAOrden(this.comentarioNuevo);

    this.ordenDeTrabajoService.crearOrden(this.orden).subscribe(
      respuesta => {
        this.router.navigate(['ordenesdetrabajo/ver/' + this.orden.numeroOrden]);
      }
    );
  }

  migrarOrden() {
    this.orden.fechaCreacion = this.CONST.fechaATexto(this.fechaCreacion + ' ' + this.horaCreacion + ' ' + this.amOpm, this.CONST.FORMATS_API.DATETIME);
    this.orden.fechaEntrega = this.CONST.fechaATexto(this.orden.fechaEntrega, this.CONST.FORMATS_API.DATE);
    this.orden.estadoPago = this.orden.saldo != 0 ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.orden.servicios.some(s => s.precio == 0) ?
        this.CONST.ESTADO_PAGO.PENDIENTE :
        this.CONST.ESTADO_PAGO.PAGADO;

    if (this.comentarioNuevo)
      this.agregarComentarioAOrden(this.comentarioNuevo);

    this.ordenDeTrabajoService.migrarOrden(this.orden).subscribe(
      respuesta => {
        this.router.navigate(['ordenesdetrabajo/ver/' + this.orden.numeroOrden]);
      }
    );
  }

  editarOrden() {
    this.ordenDeTrabajoService.editarOrden(this.orden).subscribe(
      respuesta => {
        this.router.navigate(['ordenesdetrabajo/ver/' + this.orden.numeroOrden]);
      }
    );
  }

  validarFechaDeCreacion(fecha: any) {
    var fechaDeCreacion = new Date(fecha);
    var fechaActual = this.CONST.textoAFecha(Date.now());
    if (fechaDeCreacion && fechaActual)
      this.esValidaFechaCreacion = fechaDeCreacion <= fechaActual;
  }

  calcularTotal() {
    this.orden.precioTotal = this.orden.servicios?.length ? this.orden.servicios.map(s => s.precio).reduce((a, c) => a + c) : 0;
    this.calcularSaldo();
  }

  cambiarAbono(valor: string) {
    var abono = Number.parseInt(valor.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.orden.abono = Number.isNaN(abono) ? 0 : abono;
    this.calcularSaldo();
  }

  calcularSaldo() {
    this.orden.saldo = this.orden.precioTotal - this.orden.abono;
  }

  cambiarAbonoNuevo(valor: string) {
    var abonoNuevo = Number.parseInt(valor.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.abonoNuevo = Number.isNaN(abonoNuevo) ? 0 : abonoNuevo;
    this.calcularSaldoNuevo();
  }

  calcularSaldoNuevo() {
    this.saldoNuevo = this.orden.precioTotal - (this.orden.abono + this.abonoNuevo);
  }

  validarFechaDeEntrega(fecha: any) {
    var fechaDeEntrega = new Date(fecha);
    var fechaActual = this.CONST.textoAFecha(Date.now());
    if (fechaDeEntrega && fechaActual)
      this.esValidaFechaEntrega = fechaDeEntrega >= fechaActual;
  }

  agregarComentarioAOrden(comentario: string) {
    var commentarioObject: ComentarioModel = {
      descripcion: comentario,
      nombreAdmin: this.usuarioLocal.nombre,
      fecha: this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_API.DATETIME)
    }
    this.orden.comentarios.push(commentarioObject);
  }

  private calcularEstados() {
    this.orden.estadoPago = this.orden.saldo != 0 ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.orden.servicios.every(s => s.precioEstablecido) ?
        this.CONST.ESTADO_PAGO.PAGADO : this.CONST.ESTADO_PAGO.PENDIENTE;

    this.orden.estadoOrden =
      this.orden.estadoPago == this.CONST.ESTADO_PAGO.PAGADO
        && this.orden.servicios.every(s => s.estado == this.CONST.ESTADO_SERVICIO.DESPACHADO)
        ? this.CONST.ESTADO_ORDEN.FINALIZADA
        : this.CONST.ESTADO_ORDEN.VIGENTE;
  }

  servicioEditado(comentario: string) {
    this.obtenerOrden(this.orden.numeroOrden, () => {
      this.agregarComentarioAOrden(comentario);
      this.calcularTotal();
      this.calcularEstados();
      this.editarOrden();
    });
  }

  // Funciones de modales

  cambiarCliente(cliente: ClienteModel) {
    this.orden.cliente.identificacion = cliente.identificacion;
    this.orden.cliente.nombre = cliente.nombre;
    this.orden.cliente.celular = cliente.celular;
  }

  enviarPorWhatsApp(whatsAppModal: ModalComponent) {
    var mensaje =
      'Orden de trabajo: *' + this.orden.numeroOrden + '* %0A' +
      this.CONST.fechaATexto(this.orden.fechaCreacion, this.CONST.FORMATS_VIEW.DATETIME) + '%0A %0A' +
      'Servicios: ' + '%0A';

    this.orden.servicios.forEach(s => mensaje += '- ' + s.descripcion + ' (' + (s.precioEstablecido ? this.CONST.monedaATexto(s.precio) : 'Pendiente') + ') %0A');

    mensaje += '%0A' + 'Precio total: ' + this.CONST.monedaATexto(this.orden.precioTotal) + '%0A' +
      'Abono: ' + this.CONST.monedaATexto(this.orden.abono) + '%0A' +
      'Saldo: ' + this.CONST.monedaATexto(this.orden.saldo) + '%0A %0A' +
      'Fecha de entrega: ' + this.CONST.fechaATexto(this.orden.fechaEntrega, this.CONST.FORMATS_VIEW.DATE);

    window.open(this.CONST.WHATSAPP_URL + this.whatsAppNumber + '?text=' + mensaje);

    whatsAppModal.visible = false;
  }

  descargar() {
    var nombrePDF = this.orden.numeroOrden + '-' + this.CONST.fechaATexto(new Date, this.CONST.FORMATS_VIEW.DATE);
    this.CONST.descargarPDF(this.elementoADescargar.nativeElement, nombrePDF);
  }

  abonar(abonarModal: ModalComponent) {
    this.orden.abono += this.abonoNuevo;
    this.orden.saldo = this.saldoNuevo;
    if (this.orden.saldo == 0)
      this.orden.estadoPago = this.CONST.ESTADO_PAGO.PAGADO;

    this.agregarComentarioAOrden('El cliente realizó un abono de ' +
      this.CONST.monedaATexto(this.abonoNuevo) +
      ', quedando un saldo de ' +
      this.CONST.monedaATexto(this.orden.saldo)
    );

    this.abonoNuevo = 0;
    this.saldoNuevo = 0;

    abonarModal.visible = false;
    this.calcularEstados();
    this.editarOrden();
  }

  agregarNuevoComentario(comentarioModal: ModalComponent) {
    this.agregarComentarioAOrden(this.comentarioNuevo);

    this.comentarioNuevo = '';

    comentarioModal.visible = false;
    this.editarOrden();
  }

  anular(anularModal: ModalComponent) {
    this.orden.estadoOrden = this.CONST.ESTADO_ORDEN.ANULADA;
    this.agregarComentarioAOrden('Se anuló la orden de trabajo, ' + this.comentarioAnulacion);

    this.comentarioAnulacion = '';

    anularModal.visible = false;
    this.editarOrden();
  }
}