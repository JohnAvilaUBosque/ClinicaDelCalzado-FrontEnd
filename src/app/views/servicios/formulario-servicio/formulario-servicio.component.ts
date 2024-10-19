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
      this.servicioService.obtenerServicio(this.idServicio).subscribe(
        servicio => {
          if (servicio) {
            this.servicio = servicio;
            this.btnRadioGroup.setValue({ radioEstado: servicio.estado });
            if (servicio.estado == this.CONST.ESTADO_SERVICIO.DESPACHADO)
              this.btnRadioGroup.disable();
            else
              this.btnRadioGroup.enable();

            this.establecerPrecio = false;
            this.adjustTextareasHeight();
          }
        }
      );
    }
  }

  cambiarPrecioIndividual(value: string) {
    var valorIndividual = Number.parseInt(value.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
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

  editarServicio() {
    this.servicio.estado = this.btnRadioGroup.get('radioEstado')?.value ?? this.servicio.estado;
    if (!this.servicio.precioEstablecido) this.servicio.precioEstablecido = this.establecerPrecio;
    this.servicioService.editarServicio(this.servicio).subscribe(
      respuesta => {
        this.servicioEditadoEvent.emit(respuesta);
      }
    );
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
