import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { BadgeComponent, ButtonModule, FormModule, GridModule, ModalComponent, ModalModule, TableModule, TooltipModule } from '@coreui/angular';
import { ServicioModel } from '../servicio.model';
import { ConstantsService } from 'src/app/constants.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { OperarioModel } from '../../operarios/operario.model';
import { ListadoOperariosComponent } from '../../operarios/listado-operarios/listado-operarios.component';

@Component({
  selector: 'listado-servicios',
  standalone: true,
  imports: [CommonModule, GridModule, FormsModule, FormModule, ButtonModule, TableModule, TooltipModule, ModalModule, IconDirective, BadgeComponent, ListadoOperariosComponent],
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.scss'
})
export class ListadoServiciosComponent implements OnInit, OnChanges, AfterViewInit {

  public CONST = inject(ConstantsService);

  @Input() esSoloLectura: boolean = false;
  @Input() servicios: ServicioModel[] = [];

  @Output() cambiaronPreciosEvent = new EventEmitter<string>();
  @Output() esFormularioValidoEvent = new EventEmitter<boolean>();
  @Output() agregarComentarioEvent = new EventEmitter<string>();

  public indexServicioSeleccionado: number = 0;

  @ViewChild('serviciosForm') form?: NgForm;
  @ViewChildren('textareaElement') textareas!: QueryList<ElementRef>;

  ngOnInit(): void {
    if (!this.esSoloLectura)
      this.agregarServicioAOrden();
  }

  ngAfterViewInit() {
    if (this.form)
      this.form.statusChanges?.subscribe(status => {
        this.esFormularioValidoEvent.emit(status === 'VALID');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['servicios'].currentValue?.length && this.esSoloLectura)
      this.adjustTextareasHeight();
  }

  agregarServicioAOrden() {
    var servicioNuevo = new ServicioModel();
    servicioNuevo.estado = this.CONST.ESTADO_SERVICIO.RECIBIDO;
    this.servicios.push(servicioNuevo);
  }

  cambiarPrecioIndividual(value: string, index: number) {
    var valorIndividual = Number.parseInt(value.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.servicios[index].precio = Number.isNaN(valorIndividual) ? 0 : valorIndividual;
    this.cambiaronPreciosEvent.emit();
  }

  cambiarOperario(operario: OperarioModel, index: number) {
    this.servicios[index].operario.identificacion = operario.identificacion;
    this.servicios[index].operario.nombre = operario.nombre;
    this.servicios[index].operario.celular = operario.celular;
  }

  borrarServicio(borrarServicioModel: ModalComponent, index: number) {
    this.servicios.splice(index, 1);
    this.cambiaronPreciosEvent.emit();

    borrarServicioModel.visible = false;
  }

  editarServicio(editarServicioModel: ModalComponent, index: number) {
    this.agregarComentarioEvent.emit('El servicio i cambió el atributo p del valor x al valor y');

    editarServicioModel.visible = false;
  }

  adjustTextareasHeight(): void {
    setTimeout(() =>
      this.textareas.forEach((textarea: ElementRef) => {
        textarea.nativeElement.style.height = 'auto';
        textarea.nativeElement.style.height = textarea.nativeElement.scrollHeight + 'px';
      }), 50)
  }
}
