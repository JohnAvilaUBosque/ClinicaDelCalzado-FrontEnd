import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BadgeComponent, ButtonModule, CardModule, FormModule, GridModule, TooltipModule } from '@coreui/angular';
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

@Component({
  selector: 'formulario-orden',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, IconDirective, BadgeComponent, ListadoServiciosComponent],
  templateUrl: './formulario-orden.component.html',
  styleUrl: './formulario-orden.component.scss'
})
export class FormularioOrdenComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public constService = inject(ConstantsService);

  public orden: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public esSoloLectura: boolean = false;

  @ViewChild(ListadoServiciosComponent) listadoServiciosComponent!: ListadoServiciosComponent;

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
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
                  if (ordenEncontrada)
                    this.orden = ordenEncontrada;
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
    var abono = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NUMBER, ''));
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
    throw new Error('Method not implemented.');
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
