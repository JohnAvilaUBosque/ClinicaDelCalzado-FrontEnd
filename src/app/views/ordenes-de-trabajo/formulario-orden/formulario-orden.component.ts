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
    this.usuarioLocal = this.adminService.obtenerAdminLocal();

    this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + title + ' orden de trabajo');

        if (title == 'Crear') {
          this.esModoCreacion = true;
          this.orden.numeroOrden = this.CONST.ORDEN_NUMBER_DEFAULT;
          this.orden.estadoOrden = this.CONST.ESTADO_ORDEN.VIGENTE;
          this.orden.atendidoPor = this.usuarioLocal.nombre;
          this.orden.fechaCreacion = this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_ANGULAR.DATETIME);
        }
        else if (title == 'Migrar') {
          this.esModoMigracion = true;
          this.orden.numeroOrden = this.CONST.ORDEN_NUMBER_DEFAULT;
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
    this.CONST.mostrarCargando();

    this.adminService.obtenerAdmins().subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.administradores = respuesta.objeto;
        this.CONST.ocultarCargando();
      });
  }

  obtenerOrden(numeroOrden: string) {
    this.CONST.mostrarCargando();

    this.ordenDeTrabajoService.obtenerOrden(numeroOrden).subscribe({
      next:
        respuesta => {
          if (respuesta.esError) {
            this.navegarABuscarOrden(numeroOrden);
            return;
          }

          this.orden = respuesta.objeto;
          this.whatsAppNumber = respuesta.objeto.cliente.celular;
          this.CONST.ocultarCargando();
        },
      error: () => this.navegarABuscarOrden(numeroOrden)
    });
  }

  ngSubmit() {
    if (this.esModoCreacion)
      this.crearOrden();
    else
      this.migrarOrden();
  }

  crearOrden() {
    this.CONST.mostrarCargando();

    this.orden.atendidoPor = this.administradores.find(a => a.identificacion == this.orden.atendidoPorId)?.nombre || '';
    this.orden.estadoPago = this.orden.saldo != 0 ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.orden.servicios.some(s => s.precio == 0) ?
        this.CONST.ESTADO_PAGO.PENDIENTE :
        this.CONST.ESTADO_PAGO.PAGADO;

    if (this.comentarioNuevo)
      this.agregarComentarioAOrden(this.comentarioNuevo);

    this.ordenDeTrabajoService.crearOrden(this.orden).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
        this.navegarAVerOrden(respuesta.objeto.numeroOrden);
      }
    );
  }

  migrarOrden() {
    this.CONST.mostrarCargando();

    this.orden.atendidoPor = this.administradores.find(a => a.identificacion == this.orden.atendidoPorId)?.nombre || '';
    this.orden.estadoPago = this.orden.saldo != 0 ?
      this.CONST.ESTADO_PAGO.PENDIENTE :
      this.orden.servicios.some(s => s.precio == 0) ?
        this.CONST.ESTADO_PAGO.PENDIENTE :
        this.CONST.ESTADO_PAGO.PAGADO;

    if (this.comentarioNuevo)
      this.agregarComentarioAOrden(this.comentarioNuevo);

    this.ordenDeTrabajoService.migrarOrden(this.orden).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
        this.navegarAVerOrden(respuesta.objeto.numeroOrden);
      }
    );
  }

  navegarABuscarOrden(numeroOrden: string) {
    this.router.navigate(['ordenesdetrabajo/buscar/'], { queryParams: { ordenNoEncontrada: numeroOrden } });
  }

  navegarAVerOrden(numeroOrden: string) {
    this.router.navigate(['ordenesdetrabajo/ver/' + numeroOrden]);
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
      id: 0,
      descripcion: comentario,
      nombreAdmin: this.usuarioLocal.nombre,
      fecha: this.CONST.fechaATexto(new Date(), this.CONST.FORMATS_ANGULAR.DATETIME)
    }
    this.orden.comentarios.push(commentarioObject);
  }

  servicioEditado(comentario: string) {
    this.obtenerOrden(this.orden.numeroOrden);
  }

  // Funciones de Modals

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
    this.CONST.mostrarCargando();

    this.ordenDeTrabajoService.abonarAOrden(this.orden.numeroOrden, this.abonoNuevo).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        abonarModal.visible = false;
        this.abonoNuevo = 0;
        this.saldoNuevo = 0;
        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
        this.obtenerOrden(this.orden.numeroOrden);
      }
    );
  }

  agregarNuevoComentario(comentarioModal: ModalComponent) {
    this.CONST.mostrarCargando();

    this.ordenDeTrabajoService.comentarOrden(this.orden.numeroOrden, this.comentarioNuevo).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        comentarioModal.visible = false;
        this.comentarioNuevo = '';
        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
        this.obtenerOrden(this.orden.numeroOrden);
      }
    );
  }

  anular(anularModal: ModalComponent) {
    this.CONST.mostrarCargando();

    this.ordenDeTrabajoService.anularOrden(this.orden.numeroOrden, this.comentarioAnulacion).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        anularModal.visible = false;
        this.comentarioAnulacion = '';
        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
        this.obtenerOrden(this.orden.numeroOrden);
      }
    );
  }
}