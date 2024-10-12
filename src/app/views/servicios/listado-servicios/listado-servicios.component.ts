import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { BadgeComponent, ButtonModule, FormModule, GridModule, ModalComponent, ModalModule, TableModule, TooltipModule } from '@coreui/angular';
import { ServicioModel } from '../servicio.model';
import { ConstantsService } from 'src/app/constants.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { OperarioModel } from '../../operarios/operario.model';
import { ListadoOperariosComponent } from '../../operarios/listado-operarios/listado-operarios.component';
import { FormularioServicioComponent } from '../formulario-servicio/formulario-servicio.component';

@Component({
  selector: 'listado-servicios',
  standalone: true,
  imports: [CommonModule, GridModule, FormsModule, FormModule, ButtonModule, TableModule, TooltipModule, ModalModule, IconDirective, BadgeComponent, ListadoOperariosComponent, FormularioServicioComponent],
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.scss'
})
export class ListadoServiciosComponent implements OnInit, OnChanges, AfterViewInit {

  public CONST = inject(ConstantsService);

  @Input() servicios: ServicioModel[] = [];
  @Input() esModoLectura: boolean = false;
  @Input() esOrdenAnulada: boolean = false;

  public indexServicioSeleccionado: number = 0;
  public idServicioSeleccionado: number = 0;
  public esValidoFormServicio: boolean = false;

  @Output() cambiaronPreciosEvent = new EventEmitter<string>();
  @Output() esFormularioValidoEvent = new EventEmitter<boolean>();
  @Output() servicioEditadoEvent = new EventEmitter<ServicioModel>();

  @ViewChild('serviciosForm') form!: NgForm;
  @ViewChildren('textareaElement') textareas!: QueryList<ElementRef>;

  @ViewChild('operarioModal') operarioModal!: ModalComponent;

  @ViewChild('editarServicioModal') editarServicioModal!: ModalComponent;
  @ViewChild('formularioServicio') formularioServicio!: FormularioServicioComponent;

  ngOnInit(): void {
    if (!this.esModoLectura)
      this.agregarServicioAOrden();
  }

  ngAfterViewInit() {
    if (this.form)
      this.form.statusChanges?.subscribe(status => {
        this.esFormularioValidoEvent.emit(status === 'VALID');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['servicios'].currentValue?.length && this.esModoLectura)
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

  cambiarOperario(operario: OperarioModel) {
    if (this.esModoLectura)
      this.formularioServicio.servicio.operario = operario;
    else
      this.servicios[this.indexServicioSeleccionado].operario = operario;

    this.operarioModal.visible = false;
    if (this.esModoLectura)
      this.editarServicioModal.visible = true;

    this.adjustTextareasHeight()
  }

  borrarServicio(borrarServicioModel: ModalComponent, index: number) {
    this.servicios.splice(index, 1);
    this.cambiaronPreciosEvent.emit();

    borrarServicioModel.visible = false;
  }

  servicioEditado(servicio: ServicioModel) {
    this.servicioEditadoEvent.emit(servicio);
    this.idServicioSeleccionado = 0;
  }

  seleccionarOperario() {
    this.editarServicioModal.visible = false;
    this.operarioModal.visible = true;
  }

  adjustTextareasHeight(): void {
    setTimeout(() =>
      this.textareas.forEach((textarea: ElementRef) => {
        textarea.nativeElement.style.height = 'auto';
        textarea.nativeElement.style.height = textarea.nativeElement.scrollHeight + 'px';
      }), 50)
  }
}
