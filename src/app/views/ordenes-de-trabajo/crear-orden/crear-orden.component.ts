import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OrdenDeTrabajoService } from '../orden-de-trabajo.service';
import { OrdenDeTrabajoModel } from '../orden-de-trabajo.model';
import { FormsModule } from '@angular/forms';
import { ServicioModel } from '../servicio.model';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UsuarioService } from '../../usuarios/usuario.service';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'app-crear-orden',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, IconDirective, FormsModule, BadgeComponent],
  templateUrl: './crear-orden.component.html',
  styleUrl: './crear-orden.component.scss'
})
export class CrearOrdenComponent implements OnInit {

  private ordenDeTrabajoService = inject(OrdenDeTrabajoService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public constantsService = inject(ConstantsService);

  public orden: OrdenDeTrabajoModel = new OrdenDeTrabajoModel();
  public modoVisualizacion = false;

  constructor() {
  }

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        if (title == 'Crear') {
          this.agregarServicioAOrden();
          this.orden.orderNumber = this.constantsService.ORDEN_NUMBER_DEFAULT;
          this.orden.attendedBy = this.usuarioService.obtenerUsuarioLocal()?.name;
          this.orden.createDate = formatDate(new Date(), this.constantsService.FORMATS_API.DATETIME, 'en-US');
        }
        else if (title == 'Ver') {
          this.modoVisualizacion = true;

          this.route.params.pipe(map((p) => p['id-orden'])).subscribe(
            idOrden => {
              this.ordenDeTrabajoService.obtenerOrden(idOrden).subscribe(
                ordenEncontrada => {
                  if (ordenEncontrada) this.orden = ordenEncontrada;
                }
              )
            }
          );
        }
      }
    );
  }

  onSubmit() {
    this.orden.deliveryDate = formatDate(this.orden.deliveryDate, this.constantsService.FORMATS_API.DATE, 'en-US');
    this.ordenDeTrabajoService.crearOrden(this.orden);
    this.router.navigate(['ordenesdetrabajo/ver/' + 'ORD-2024-00003']); // TO DO: Hacer esto dentro del suscribe del crear orden
  }

  agregarServicioAOrden() {
    this.orden.services.push(new ServicioModel())
  }

  borrarServicio(index: number) {
    this.orden.services.splice(index, 1);
    this.calcularTotal();
  }

  cambiarValorIndividual(value: string, index: number) {
    var valorIndividual = Number.parseInt(value.replace(this.constantsService.REGULAR_EXP.NUMBER, ''));
    this.orden.services[index].price = Number.isNaN(valorIndividual) ? 0 : valorIndividual;
    this.calcularTotal();
  }

  cambiarAbono(value: string) {
    var abono = Number.parseInt(value.replace(this.constantsService.REGULAR_EXP.NUMBER, ''));
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

}
