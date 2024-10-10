import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ButtonGroupComponent, ButtonModule, FormCheckLabelDirective, FormModule, GridModule, ModalModule, TooltipModule } from '@coreui/angular';
import { ConstantsService } from 'src/app/constants.service';
import { ServicioModel } from '../servicio.model';
import { OperarioModel } from '../../operarios/operario.model';
import { ListadoOperariosComponent } from '../../operarios/listado-operarios/listado-operarios.component';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'formulario-servicio',
  standalone: true,
  imports: [CommonModule, FormModule, GridModule, FormsModule, ReactiveFormsModule, ButtonModule, TooltipModule, ModalModule, ButtonGroupComponent, IconDirective, FormCheckLabelDirective, ListadoOperariosComponent],
  templateUrl: './formulario-servicio.component.html',
  styleUrl: './formulario-servicio.component.scss'
})
export class FormularioServicioComponent implements OnInit, OnChanges, AfterViewInit {

  public CONST = inject(ConstantsService);

  @Input() servicio: ServicioModel = new ServicioModel();
  @Input() ocultarBoton: boolean = false;

  public editarPrecio: boolean = false;

  private formBuilder = inject(FormBuilder);
  public btnRadioGroup = this.formBuilder.group({
    radioEstado: new FormControl('')
  });

  @Output() esFormularioValidoEvent = new EventEmitter<boolean>();

  @ViewChild('datosSeguridadForm') form?: NgForm;
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
    if (changes['servicio'].currentValue?.length)
      this.adjustTextareasHeight();
  }

  cambiarPrecioIndividual(value: string) {
    var valorIndividual = Number.parseInt(value.replace(this.CONST.REGULAR_EXP.NOT_NUMBER, ''));
    this.servicio.precio = Number.isNaN(valorIndividual) ? 0 : valorIndividual;
  }

  cambiarEstado(value: string): void {
    this.btnRadioGroup.setValue({ radioEstado: value });
    this.servicio.estado = value;
  }

  cambiarOperario(operario: OperarioModel) {
    this.servicio.operario.identificacion = operario.identificacion;
    this.servicio.operario.nombre = operario.nombre;
    this.servicio.operario.celular = operario.celular;
  }

  editarServicio() {
    throw new Error('Method not implemented');
  }

  adjustTextareasHeight(): void {
    setTimeout(() =>
      this.textareas.forEach((textarea: ElementRef) => {
        textarea.nativeElement.style.height = 'auto';
        textarea.nativeElement.style.height = textarea.nativeElement.scrollHeight + 'px';
      }), 50)
  }
}
