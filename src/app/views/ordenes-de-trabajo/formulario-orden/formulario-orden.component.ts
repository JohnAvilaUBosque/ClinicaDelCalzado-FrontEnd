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
import { ListadoServiciosComponent } from '../listado-servicios/listado-servicios.component';
import { ListadoClientesComponent } from '../listado-clientes/listado-clientes.component';
import { Title } from '@angular/platform-browser';
import { ClienteModel } from '../cliente.model';

@Component({
  selector: 'formulario-orden',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ModalModule, IconDirective, BadgeComponent, ListadoServiciosComponent, ListadoClientesComponent],
  templateUrl: './formulario-orden.component.html',
  styleUrl: './formulario-orden.component.scss'
})
export class FormularioOrdenComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private usuarioService = inject(UsuarioService);
  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public constService = inject(ConstantsService);

  public orden: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public esSoloLectura: boolean = false;
  public sonValidosServicios: boolean = false;

  public whatsAppNumber: string = '';
  public commentarioNuevo: string = '';
  public abonoNuevo: number = 0;
  public saldoNuevo: number = 0;

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + title + ' orden de trabajo');

        if (title == 'Crear') {
          this.orden.numeroOrden = this.constService.ORDEN_NUMBER_DEFAULT;
          this.orden.atendidoPor = this.usuarioService.obtenerAdminLocal()?.nombre;
          this.orden.fechaCreacion = this.constService.fechaATexto(new Date(), this.constService.FORMATS_API.DATETIME);
          this.orden.estadoOrden = this.constService.ESTADO_ORDEN.VIGENTE;
          this.orden.estadoPago = this.constService.ESTADO_PAGO.PENDIENTE;
        }
        else if (title == 'Ver') {
          this.esSoloLectura = true;

          this.route.params.pipe(map((p) => p['id-orden'])).subscribe(
            idOrden => {

              this.ordenDeTrabajoService.obtenerOrden(idOrden).subscribe(
                ordenEncontrada => {
                  if (ordenEncontrada) {
                    this.orden = ordenEncontrada;
                    this.whatsAppNumber = ordenEncontrada.cliente.celular;
                  }
                  else
                    this.router.navigate(['ordenesdetrabajo/buscar'], { queryParams: { ordenNoEncontrada: idOrden } });
                }
              )
            }
          );
        }
      }
    );
  }

  crearOrden() {
    this.orden.fechaCreacion = this.constService.fechaATexto(new Date(), this.constService.FORMATS_API.DATETIME);
    this.orden.fechaEntrega = this.constService.fechaATexto(this.orden.fechaEntrega, this.constService.FORMATS_API.DATE);
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
    var abono = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NOT_NUMBER, ''));
    this.orden.abono = Number.isNaN(abono) ? 0 : abono;
    this.calcularSaldo();
  }

  calcularSaldo() {
    this.orden.saldo = this.orden.precioTotal - this.orden.abono;
  }

  cambiarAbonoNuevo(value: string) {
    var abonoNuevo = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NOT_NUMBER, ''));
    this.abonoNuevo = Number.isNaN(abonoNuevo) ? 0 : abonoNuevo;
    this.calcularSaldoNuevo();
  }

  calcularSaldoNuevo() {
    this.saldoNuevo = this.orden.precioTotal - (this.orden.abono + this.abonoNuevo);
  }

  private agregarComentarioAOrden(comentario: string) {
    var commentarioObject: ComentarioModel = {
      descripcion: comentario,
      nombreAdmin: this.usuarioService.obtenerAdminLocal()?.nombre,
      fecha: this.constService.fechaATexto(new Date(), this.constService.FORMATS_API.DATETIME)
    }
    this.orden.comentarios.push(commentarioObject);
  }

  private editarOrden() {
    this.ordenDeTrabajoService.editarOrden(this.orden).subscribe(
      respuesta => {
        this.router.navigate(['ordenesdetrabajo/ver/' + this.orden.numeroOrden]);
      }
    );
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
      this.constService.fechaATexto(this.orden.fechaCreacion, this.constService.FORMATS_VIEW.DATETIME) + '%0A %0A' +
      'Servicios: ' + '%0A';

    this.orden.servicios.forEach(s => mensaje += '- ' + s.descripcion + ' (' + this.constService.monedaATexto(s.precio) + ') %0A');

    mensaje += '%0A' + 'Precio total: ' + this.constService.monedaATexto(this.orden.precioTotal) + '%0A' +
      'Abono: ' + this.constService.monedaATexto(this.orden.abono) + '%0A' +
      'Saldo: ' + this.constService.monedaATexto(this.orden.saldo) + '%0A %0A' +
      'Fecha de entrega: ' + this.constService.fechaATexto(this.orden.fechaEntrega, this.constService.FORMATS_VIEW.DATE);

    window.open(this.constService.WHATSAPP_URL + this.whatsAppNumber + '?text=' + mensaje);

    whatsAppModal.visible = false;
  }

  descargar(descargarModal: ModalComponent) {

    descargarModal.visible = false;
  }

  abonar(abonarModal: ModalComponent) {
    this.orden.abono += this.abonoNuevo;
    this.orden.saldo = this.saldoNuevo;
    this.agregarComentarioAOrden('El cliente realizó un abono de ' +
      this.constService.monedaATexto(this.abonoNuevo) +
      ', quedando un saldo de ' +
      this.constService.monedaATexto(this.orden.saldo)
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

  cambiarEstadoServicios(estadoServiciosModel: ModalComponent) {
    this.agregarComentarioAOrden('El servicio x cambió de estado a ENTREGADO');

    estadoServiciosModel.visible = false;
    this.editarOrden();
  }

  anular(anularModal: ModalComponent) {
    this.orden.estadoOrden = this.constService.ESTADO_ORDEN.ANULADA
    this.agregarComentarioAOrden('Se canceló la orden de trabajo');

    anularModal.visible = false;
    this.editarOrden();
  }

}
