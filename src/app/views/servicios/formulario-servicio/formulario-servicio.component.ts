import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule, ButtonGroupComponent, ButtonModule, FormCheckLabelDirective, FormModule, GridModule, ModalModule, TooltipModule } from '@coreui/angular';
import { ConstantsService } from 'src/app/constants.service';
import { ServicioModel } from '../servicio.model';
import { ServicioService } from '../servicio.service';
import { OperarioModel } from '../../operarios/operario.model';
import { ListadoOperariosComponent } from '../../operarios/listado-operarios/listado-operarios.component';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'formulario-servicio',
  standalone: true,
  imports: [CommonModule, FormModule, GridModule, FormsModule, ReactiveFormsModule, ButtonModule, TooltipModule, ModalModule, BadgeModule, ButtonGroupComponent, IconDirective, FormCheckLabelDirective, ListadoOperariosComponent],
  templateUrl: './formulario-servicio.component.html',
  styleUrl: './formulario-servicio.component.scss'
})
export class FormularioServicioComponent implements OnInit, OnChanges, AfterViewInit {

  private servicioService = inject(ServicioService);

  public CONST = inject(ConstantsService);

  @Input() idServicio: number = 0;
  @Input() ocultarBoton: boolean = false;

  public servicio: ServicioModel = new ServicioModel();
  public establecerPrecio: boolean = false;

  private formBuilder = inject(FormBuilder);
  public radioEstado = new FormControl('');
  public btnRadioGroup = this.formBuilder.group({
    radioEstado: this.radioEstado
  });

  @Output() esFormularioValidoEvent = new EventEmitter<boolean>();
  @Output() servicioEditadoEvent = new EventEmitter<string>();
  @Output() seleccionarOperarioEvent = new EventEmitter();

  @ViewChild('servicioForm') form!: NgForm;
  @ViewChildren('textareaElement') textareas!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.btnRadioGroup.setValue({ radioEstado: this.servicio.estado });
  }

  ngAfterViewInit() {
    if (this.form)
      this.form.statusChanges?.subscribe(status => {
        this.esFormularioValidoEvent.emit(status === 'VALID');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.idServicio && changes['idServicio'].currentValue != changes['idServicio'].previousValue) {
      this.obtenerServicio();
    }
  }

  obtenerServicio() {
    this.CONST.mostrarCargando();

    this.servicioService.obtenerServicio(this.idServicio).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.servicio = respuesta.objeto;
        this.establecerPrecio = false;
        this.adjustTextareasHeight();
        this.cambiarEstado(this.servicio.estado);
        if (this.servicio.estado == this.CONST.ESTADO_SERVICIO.DESPACHADO)
          this.btnRadioGroup.disable();
        else
          this.btnRadioGroup.enable();

        this.CONST.ocultarCargando();
      }
    );
  }

  editarServicio() {
    this.CONST.mostrarCargando();

    var servicioEditado: ServicioModel = this.servicio;
    servicioEditado.estado = this.btnRadioGroup.get('radioEstado')?.value ?? this.servicio.estado;
    if (!servicioEditado.precioEstablecido) servicioEditado.precioEstablecido = this.establecerPrecio;

    this.servicioService.editarServicio(servicioEditado).subscribe(
      respuesta => {
        if (respuesta.esError) return;

        this.CONST.ocultarCargando();
        this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);

        var comentario = this.generarComentario(servicioEditado, this.servicio);
        this.servicioEditadoEvent.emit(comentario);
        this.servicio = new ServicioModel();
      }
    );
  }

  generarComentario(servicioEditado: ServicioModel, servicioAntes: ServicioModel) {
    var comentario = 'Se edito el servicio "' + servicioEditado.descripcion + '"';

    if (servicioEditado.operario.nombre != servicioAntes.operario.nombre)
      comentario += ', se cambió el operador a ' + servicioEditado.operario.nombre;

    if (servicioEditado.precio != servicioAntes.precio)
      comentario += ', se cambió el precio a ' + servicioEditado.precio;

    if (servicioEditado.estado != servicioAntes.estado)
      comentario += ', se cambió el estado a "' + servicioEditado.estado;

    return comentario;
  }

  cambiarPrecioIndividual(value: string) {
    var valorIndividual = Number.parseInt(value.replaceAll(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.servicio.precio = Number.isNaN(valorIndividual) ? 0 : valorIndividual;
  }

  cambiarEstado(value: string): void {
    this.btnRadioGroup.setValue({ radioEstado: value });
  }

  cambiarOperario(operario: OperarioModel) {
    this.servicio.operario.identificacion = operario.identificacion;
    this.servicio.operario.nombre = operario.nombre;
    this.servicio.operario.celular = operario.celular;
  }

  seleccionarOperario() {
    this.seleccionarOperarioEvent.emit();
  }

  adjustTextareasHeight(): void {
    setTimeout(() =>
      this.textareas.forEach((textarea: ElementRef) => {
        textarea.nativeElement.style.height = 'auto';
        textarea.nativeElement.style.height = textarea.nativeElement.scrollHeight + 'px';
      }), 50)
  }

}
