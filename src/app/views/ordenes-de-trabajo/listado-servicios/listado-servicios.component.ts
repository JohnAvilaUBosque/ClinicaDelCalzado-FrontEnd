import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { BadgeComponent, ButtonModule, FormModule, GridModule, TableModule, TooltipModule } from '@coreui/angular';
import { ServicioModel } from '../servicio.model';
import { ConstantsService } from 'src/app/constants.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'listado-servicios',
  standalone: true,
  imports: [CommonModule, GridModule, FormsModule, FormModule, ButtonModule, TableModule, TooltipModule, IconDirective, BadgeComponent],
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.scss'
})
export class ListadoServiciosComponent implements OnInit, OnChanges {

  public constService = inject(ConstantsService);

  @Input() esSoloLectura: boolean = false;
  @Input() services: ServicioModel[] = [];

  @Output() cambiaronPreciosEvent = new EventEmitter<string>();

  @ViewChildren('textareaElement') textareas!: QueryList<ElementRef>;

  ngOnInit(): void {
    if (!this.esSoloLectura)
      this.agregarServicioAOrden();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['services'].currentValue?.length && this.esSoloLectura)
      setTimeout(() =>
        this.textareas.forEach((textarea: ElementRef) =>
          this.adjustTextareaHeight(textarea.nativeElement)
        ), 100);
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

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
