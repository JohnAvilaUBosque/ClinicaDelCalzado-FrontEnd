import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { BadgeComponent, ButtonModule, FormModule, GridModule, TableModule, TooltipModule } from '@coreui/angular';
import { ServicioModel } from '../servicio.model';
import { ConstantsService } from 'src/app/constants.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'listado-servicios',
  standalone: true,
  imports: [CommonModule, GridModule, FormsModule, FormModule, ButtonModule, TableModule, TooltipModule, IconDirective, BadgeComponent],
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.scss'
})
export class ListadoServiciosComponent implements OnInit, OnChanges, AfterViewInit {

  public constService = inject(ConstantsService);

  @Input() esSoloLectura: boolean = false;
  @Input() servicios: ServicioModel[] = [];

  @Output() cambiaronPreciosEvent = new EventEmitter<string>();
  @Output() esFormularioValido = new EventEmitter<boolean>();

  @ViewChild('serviciosForm') form?: NgForm;

  @ViewChildren('textareaElement') textareas!: QueryList<ElementRef>;

  ngOnInit(): void {
    if (!this.esSoloLectura)
      this.agregarServicioAOrden();
  }

  ngAfterViewInit() {
    if (this.form)
      this.form.statusChanges?.subscribe(status => {
        this.esFormularioValido.emit(status === 'VALID');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['servicios'].currentValue?.length && this.esSoloLectura)
      setTimeout(() =>
        this.textareas.forEach((textarea: ElementRef) =>
          this.adjustTextareaHeight(textarea.nativeElement)
        ), 100);
  }

  agregarServicioAOrden() {
    var servicioNuevo = new ServicioModel();
    servicioNuevo.estado = this.constService.ESTADO_SERVICIO.RECIBIDO;
    this.servicios.push(servicioNuevo);
  }

  cambiarPrecioIndividual(value: string, index: number) {
    var valorIndividual = Number.parseInt(value.replace(this.constService.REGULAR_EXP.NOT_NUMBER, ''));
    this.servicios[index].precio = Number.isNaN(valorIndividual) ? 0 : valorIndividual;
    this.cambiaronPreciosEvent.emit();
  }

  borrarServicio(index: number) {
    this.servicios.splice(index, 1);
    this.cambiaronPreciosEvent.emit();
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
