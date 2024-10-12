import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonModule, CardModule, FormModule, GridModule, ModalComponent, ModalModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service';
import { OrdenDeTrabajoModel, ComentarioModel } from '../orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UsuarioService } from '../../usuarios/usuario.service';
import { ConstantsService } from 'src/app/constants.service';
import { ListadoServiciosComponent } from '../../servicios/listado-servicios/listado-servicios.component';
import { ListadoClientesComponent } from '../../clientes/listado-clientes/listado-clientes.component';
import { ListadoOperariosComponent } from '../../operarios/listado-operarios/listado-operarios.component';
import { Title } from '@angular/platform-browser';
import { ClienteModel } from '../../clientes/cliente.model';
import { ServicioModel } from '../../servicios/servicio.model';

@Component({
  selector: 'formulario-orden',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ModalModule, IconDirective, BadgeComponent, ListadoServiciosComponent, ListadoClientesComponent, ListadoOperariosComponent],
  templateUrl: './formulario-orden.component.html',
  styleUrl: './formulario-orden.component.scss'
})
export class FormularioOrdenComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public orden: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public esModoLectura: boolean = false;
  public sonValidosServicios: boolean = false;
  public esFechaEntregaValida: boolean = false;

  public whatsAppNumber: string = '';
  public commentarioNuevo: string = '';
  public abonoNuevo: number = 0;
  public saldoNuevo: number = 0;

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + title + ' orden de trabajo');

        if (title == 'Crear') {
          this.orden.numeroOrden = this.CONST.ORDEN_NUMBER_DEFAULT;
          this.orden.atendidoPor = this.usuarioService.obtenerAdminLocal()?.nombre;
          this.orden.fechaCreacion = this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_API.DATETIME);
          this.orden.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
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

  obtenerOrden(numeroOrden: string) {
    this.ordenDeTrabajoService.obtenerOrden(numeroOrden).subscribe(
      ordenEncontrada => {
        if (ordenEncontrada) {
          this.orden = ordenEncontrada;
          this.whatsAppNumber = ordenEncontrada.cliente.celular;
        }
        else
          this.router.navigate(['ordenesdetrabajo/buscar/'], { queryParams: { ordenNoEncontrada: numeroOrden } });
      }
    );
  }

  crearOrden() {
    this.orden.fechaCreacion = this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_API.DATETIME);
    this.orden.fechaEntrega = this.CONST.fechaATexto(this.orden.fechaEntrega, this.CONST.FORMATS_API.DATE);
    this.orden.estadoPago = this.orden.saldo != 0 ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.orden.servicios.some(s => s.precio == 0) ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.CONST.ESTADO_PAGO.PAGADO;

    if (this.commentarioNuevo)
      this.agregarComentarioAOrden(this.commentarioNuevo);

    this.ordenDeTrabajoService.crearOrden(this.orden).subscribe(
      respuesta => {
        this.router.navigate(['ordenesdetrabajo/ver/' + this.orden.numeroOrden]);
      }
    );
  }

  calcularTotal() {
    this.orden.precioTotal = this.orden.servicios?.length ? this.orden.servicios.map(s => s.precio).reduce((a, c) => a + c) : 0;
    this.calcularSaldo();
  }

  cambiarAbono(value: string) {
    var abono = Number.parseInt(value.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.orden.abono = Number.isNaN(abono) ? 0 : abono;
    this.calcularSaldo();
  }

  calcularSaldo() {
    this.orden.saldo = this.orden.precioTotal - this.orden.abono;
  }

  cambiarAbonoNuevo(value: string) {
    var abonoNuevo = Number.parseInt(value.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.abonoNuevo = Number.isNaN(abonoNuevo) ? 0 : abonoNuevo;
    this.calcularSaldoNuevo();
  }

  calcularSaldoNuevo() {
    this.saldoNuevo = this.orden.precioTotal - (this.orden.abono + this.abonoNuevo);
  }

  validarFechaDeEntrega(fecha: any) {
    this.esFechaEntregaValida = new Date(fecha) > new Date();
  }

  agregarComentarioAOrden(comentario: string) {
    var commentarioObject: ComentarioModel = {
      descripcion: comentario,
      nombreAdmin: this.usuarioService.obtenerAdminLocal()?.nombre,
      fecha: this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_API.DATETIME)
    }
    this.orden.comentarios.push(commentarioObject);
  }

  editarOrden() {
    this.orden.estadoPago = this.orden.saldo != 0 ?
    this.CONST.ESTADO_PAGO.PENDIENTE :
    this.orden.servicios.every(s => s.precioEstablecido) ?
      this.CONST.ESTADO_PAGO.PAGADO : this.CONST.ESTADO_PAGO.PENDIENTE;

    this.orden.estadoOrden =
      this.orden.estadoPago == this.CONST.ESTADO_PAGO.PAGADO
        && this.orden.servicios.every(s => s.estado == this.CONST.ESTADO_SERVICIO.DESPACHADO)
        ? this.CONST.ESTADO_ORDEN.FINALIZADA
        : this.CONST.ESTADO_ORDEN.VIGENTE;

    this.ordenDeTrabajoService.editarOrden(this.orden).subscribe(
      respuesta => {
        this.router.navigate(['ordenesdetrabajo/ver/' + this.orden.numeroOrden]);
      }
    );
  }

  servicioEditado(servicio: ServicioModel) {
    this.obtenerOrden(this.orden.numeroOrden);
    setTimeout(() => {
      this.agregarComentarioAOrden('Se edito el servicio "' + servicio.descripcion + '"');
      this.calcularTotal();
      this.editarOrden();
    }, 100);
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

    this.orden.servicios.forEach(s => mensaje += '- ' + s.descripcion + ' (' + this.CONST.monedaATexto(s.precio) + ') %0A');

    mensaje += '%0A' + 'Precio total: ' + this.CONST.monedaATexto(this.orden.precioTotal) + '%0A' +
      'Abono: ' + this.CONST.monedaATexto(this.orden.abono) + '%0A' +
      'Saldo: ' + this.CONST.monedaATexto(this.orden.saldo) + '%0A %0A' +
      'Fecha de entrega: ' + this.CONST.fechaATexto(this.orden.fechaEntrega, this.CONST.FORMATS_VIEW.DATE);

    window.open(this.CONST.WHATSAPP_URL + this.whatsAppNumber + '?text=' + mensaje);

    whatsAppModal.visible = false;
  }

  descargar(descargarModal: ModalComponent) {

    descargarModal.visible = false;
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
    this.editarOrden();
  }

  agregarNuevoComentario(comentarioModal: ModalComponent) {
    this.agregarComentarioAOrden(this.commentarioNuevo);

    this.commentarioNuevo = '';

    comentarioModal.visible = false;
    this.editarOrden();
  }

  anular(anularModal: ModalComponent) {
    this.orden.estadoOrden = this.CONST.ESTADO_ORDEN.ANULADA
    this.agregarComentarioAOrden('Se canceló la orden de trabajo');

    anularModal.visible = false;
    this.editarOrden();
  }

}
