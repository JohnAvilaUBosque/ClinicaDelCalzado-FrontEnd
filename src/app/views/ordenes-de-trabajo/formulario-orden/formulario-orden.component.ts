import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BadgeComponent, ButtonModule, CardModule, FormModule, GridModule, ModalModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service';
import { OrdenDeTrabajoModel } from '../orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UsuarioService } from '../../usuarios/usuario.service';
import { ConstantsService } from 'src/app/constants.service';
import { ListadoServiciosComponent } from '../listado-servicios/listado-servicios.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'formulario-orden',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ModalModule, IconDirective, BadgeComponent, ListadoServiciosComponent],
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
  public whatsAppNumber: string = '';
  public esSoloLectura: boolean = false;

  @ViewChild(ListadoServiciosComponent) listadoServiciosComponent!: ListadoServiciosComponent;

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.constService.TITLE + ' - ' + title + ' orden de trabajo');

        if (title == 'Crear') {
          this.orden.orderNumber = this.constService.ORDEN_NUMBER_DEFAULT;
          this.orden.attendedBy = this.usuarioService.obtenerUsuarioLocal()?.name;
          this.orden.createDate = formatDate(new Date(), this.constService.FORMATS_API.DATETIME, 'en-US');
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
                    this.router.navigate(['ordenesdetrabajo/buscar/' + idOrden]);
                }
              )
            }
          );
        }
      }
    );
  }

  onSubmit() {
    this.orden.deliveryDate = formatDate(this.orden.deliveryDate, this.constService.FORMATS_API.DATE, 'en-US');
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

  enviarPorWhatsApp() {
    // var mensaje =
    //   `Orden de trabajo #${this.orden.orderNumber}
    //   Fecha de creación: ${formatDate(this.orden.createDate, this.constService.FORMATS_VIEW.DATETIME, 'en-US')}
    //   Precio total: $${this.orden.totalValue}
    //   Abono: $${this.orden.downPayment}
    //   Saldo: $${this.orden.balance}
    //   Fecha de entrega: ${formatDate(this.orden.deliveryDate, this.constService.FORMATS_VIEW.DATE, 'en-US')}
    //   Comentario: ${this.orden.comment}
    //   `;
      
    var mensaje =
    'Orden de trabajo ' + this.orden.orderNumber + '%0A%0A' +
    'Fecha de creación: ' + formatDate(this.orden.createDate, this.constService.FORMATS_VIEW.DATETIME, 'en-US') + '%0A' +
    'Precio total: $' + this.orden.totalValue + '%0A' +
    'Abono: $' + this.orden.downPayment + '%0A' +
    'Saldo: $' + this.orden.balance + '%0A' +
    'Fecha de entrega: ' + formatDate(this.orden.deliveryDate, this.constService.FORMATS_VIEW.DATE, 'en-US') + '%0A' +
    'Comentario: ' + this.orden.comment;

    window.open(this.constService.WHATSAPP_URL + this.whatsAppNumber + '?text=' + mensaje);
  }

  descargarOrden() {
    throw new Error('Method not implemented.');
  }

  abonarAOrden() {
    throw new Error('Method not implemented.');
  }

  agregarComentario() {
    throw new Error('Method not implemented.');
  }

  cambiarEstadoServicios() {
    throw new Error('Method not implemented.');
  }

  cancelarOrden() {
    throw new Error('Method not implemented.');
  }
}
