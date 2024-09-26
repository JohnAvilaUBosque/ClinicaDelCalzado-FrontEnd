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
import { ClienteModel } from '../client.model';

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

  public whatsAppNumber: string = '';
  public commentarioNuevo: string = '';
  public abonoNuevo: number = 0;
  public saldoNuevo: number = 0;

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + title + ' orden de trabajo');

        if (title == 'Crear') {
          this.orden.orderNumber = this.constService.ORDEN_NUMBER_DEFAULT;
          this.orden.attendedById = this.usuarioService.obtenerAdminLocal()?.identification;
          this.orden.attendedBy = this.usuarioService.obtenerAdminLocal()?.name;
          this.orden.createDate = this.constService.fechaATexto(new Date(), this.constService.FORMATS_API.DATETIME);
          this.orden.orderStatus = this.constService.ESTADO_ORDEN.VIGENTE;
          this.orden.paymentStatus = this.constService.ESTADO_PAGO.PENDIENTE;
        }
        else if (title == 'Ver') {
          this.esSoloLectura = true;

          this.route.params.pipe(map((p) => p['id-orden'])).subscribe(
            idOrden => {

              this.ordenDeTrabajoService.obtenerOrden(idOrden).subscribe(
                ordenEncontrada => {
                  if (ordenEncontrada) {
                    this.orden = ordenEncontrada;
                    this.whatsAppNumber = ordenEncontrada.client.cellphone;
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
    this.orden.deliveryDate = this.constService.fechaATexto(this.orden.deliveryDate, this.constService.FORMATS_API.DATE);
    if (this.commentarioNuevo)
      this.agregarComentarioAOrden(this.commentarioNuevo);

    this.ordenDeTrabajoService.crearOrden(this.orden);
    this.router.navigate(['ordenesdetrabajo/ver/' + 'ORD-2024-00003']); // TO DO: Hacer esto dentro del suscribe del crear orden
  }

  cambiarAbono(value: string) {
    var abono = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NOT_NUMBER, ''));
    this.orden.downPayment = Number.isNaN(abono) ? 0 : abono;
    this.calcularSaldo();
  }

  calcularTotal() {
    this.orden.totalValue = this.orden.services?.length ? this.orden.services.map(x => x.price).reduce((a, c) => a + c) : 0;
    this.calcularSaldo();
  }

  calcularSaldo() {
    this.orden.balance = this.orden.totalValue - this.orden.downPayment;
  }

  cambiarAbonoNuevo(value: string) {
    var abonoNuevo = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NOT_NUMBER, ''));
    this.abonoNuevo = Number.isNaN(abonoNuevo) ? 0 : abonoNuevo;
    this.calcularSaldoNuevo();
  }

  calcularSaldoNuevo() {
    this.saldoNuevo = this.orden.totalValue - (this.orden.downPayment + this.abonoNuevo);
  }

  private agregarComentarioAOrden(comentario: string) {
    var commentarioObject: ComentarioModel = {
      comment: comentario,
      adminName: this.usuarioService.obtenerAdminLocal()?.name,
      date: this.constService.fechaATexto(new Date(), this.constService.FORMATS_API.DATETIME)
    }
    this.orden.comments.push(commentarioObject);
  }

  // Funciones de modales

  cambiarCliente(cliente: ClienteModel) {
    this.orden.client.identification = cliente.identification;
    this.orden.client.name = cliente.name;
    this.orden.client.cellphone = cliente.cellphone;
  }

  enviarPorWhatsApp(whatsAppModal: ModalComponent) {
    var mensaje =
      'Orden de trabajo: *' + this.orden.orderNumber + '* %0A' +
      this.constService.fechaATexto(this.orden.createDate, this.constService.FORMATS_VIEW.DATETIME) + '%0A %0A' +
      'Servicios: ' + '%0A';

    this.orden.services.forEach(x => mensaje += '- ' + x.name + ' (' + this.constService.monedaATexto(x.price) + ') %0A');

    mensaje += '%0A' + 'Precio total: ' + this.constService.monedaATexto(this.orden.totalValue) + '%0A' +
      'Abono: ' + this.constService.monedaATexto(this.orden.downPayment) + '%0A' +
      'Saldo: ' + this.constService.monedaATexto(this.orden.balance) + '%0A %0A' +
      'Fecha de entrega: ' + this.constService.fechaATexto(this.orden.deliveryDate, this.constService.FORMATS_VIEW.DATE);

    window.open(this.constService.WHATSAPP_URL + this.whatsAppNumber + '?text=' + mensaje);

    whatsAppModal.visible = false;
  }

  descargar(descargarModal: ModalComponent) {

    descargarModal.visible = false;
  }

  abonar(abonarModal: ModalComponent) {
    this.orden.downPayment += this.abonoNuevo;
    this.orden.balance = this.saldoNuevo;
    this.agregarComentarioAOrden("El cliente realizó un abono de " +
      this.constService.monedaATexto(this.orden.downPayment) +
      ", quedando un saldo de " +
      this.constService.monedaATexto(this.orden.balance)
    );

    this.abonoNuevo = 0;
    this.saldoNuevo = 0;

    abonarModal.visible = false;
  }

  agregarNuevoComentario(comentarioModal: ModalComponent) {
    this.agregarComentarioAOrden(this.commentarioNuevo);

    this.commentarioNuevo = "";

    comentarioModal.visible = false;
  }

  cambiarEstadoServicios(estadoServiciosModel: ModalComponent) {
    this.agregarComentarioAOrden("El servicio 'Reparar zapatos' cambió de estado a ENTREGADO");

    estadoServiciosModel.visible = false;
  }

  anular(anularModal: ModalComponent) {
    this.orden.orderStatus = this.constService.ESTADO_ORDEN.ANULADA
    this.agregarComentarioAOrden("Se canceló la orden de trabajo");

    anularModal.visible = false;
  }

}
