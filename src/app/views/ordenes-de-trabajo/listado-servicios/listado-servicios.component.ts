import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { BadgeComponent, ButtonModule, FormModule, GridModule, TableModule } from '@coreui/angular';
import { ServicioModel } from '../servicio.model';
import { ConstantsService } from 'src/app/constants.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'listado-servicios',
  standalone: true,
  imports: [CommonModule, GridModule, FormsModule, FormModule, ButtonModule, TableModule, IconDirective, BadgeComponent],
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.scss'
})
export class ListadoServiciosComponent implements OnInit {

  public constService = inject(ConstantsService);

  @Input() esSoloLectura: boolean = false;
  @Input() services: ServicioModel[] = [];

  @Output() cambiaronPreciosEvent = new EventEmitter<string>();

  ngOnInit(): void {
    if (!this.esSoloLectura)
      this.agregarServicioAOrden();
  }

  agregarServicioAOrden() {
    this.services.push(new ServicioModel());
  }

  cambiarPrecioIndividual(value: string, index: number) {
    var valorIndividual = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NOT_NUMBER, ''));
    this.services[index].price = Number.isNaN(valorIndividual) ? 0 : valorIndividual;
    this.cambiaronPreciosEvent.emit();
  }

  borrarServicio(index: number) {
    this.services.splice(index, 1);
    this.cambiaronPreciosEvent.emit();
  }

}
