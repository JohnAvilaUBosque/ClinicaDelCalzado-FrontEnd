import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonGroupComponent, ButtonModule, CardModule, FormCheckLabelDirective, FormModule, GridModule, ModalModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OperarioService } from '../operario.service';
import { OperarioModel } from '../operario.model';
import { FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';
import { DatosSeguridadComponent } from '../../usuarios/datos-seguridad/datos-seguridad.component';

@Component({
  selector: 'formulario-operario',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ReactiveFormsModule, ModalModule, RouterModule, ButtonGroupComponent, IconDirective, BadgeComponent, FormCheckLabelDirective, DatosSeguridadComponent],
  templateUrl: './formulario-operario.component.html',
  styleUrl: './formulario-operario.component.scss'
})
export class FormularioOperarioComponent {

  private operarioService = inject(OperarioService);
  private titleService = inject(Title);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public CONST = inject(ConstantsService);

  public titulo: string = '';

  public esModoCreacion: boolean = false;
  public esModoEdicion: boolean = false;
  public esModoLectura: boolean = false;

  public operario: OperarioModel = new OperarioModel();

  public btnRadioGroup = this.formBuilder.group({
    radioEstado: new FormControl('')
  });

  ngOnInit(): void {
    this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - ' + title + ' operario');

        this.titulo = title;
        if (title == 'Agregar') {
          this.habilitarModoCreacion();
          this.cambiarEstado(this.CONST.ESTADO_OPERARIO.ACTIVO);
          this.btnRadioGroup.disable();
        }
        else if (title == 'Editar') {
          this.habilitarModoEdicion();
          this.obtenerOperario();
        }
        else if (title == 'Ver') {
          this.habilitarModoLectura();
          this.obtenerOperario();
        }
      }
    );

  }

  obtenerOperario() {
    this.CONST.mostrarCargando();

    this.route.params.pipe(map((p) => p['id-operario'])).subscribe(
      idOperario => {
        this.operarioService.obtenerOperario(idOperario).subscribe({
          next:
            respuesta => {
              if (respuesta.esError) {
                this.navegarAListado();
                return;
              }

              this.operario = respuesta.objeto;
              this.cambiarEstado(this.operario.estado);
              if (this.esModoLectura)
                this.btnRadioGroup.disable();

              this.CONST.ocultarCargando();
            },
          error: () => this.navegarAListado()
        });
      });
  }

  onSubmit() {
    if (this.esModoEdicion) {
      this.operarioService.editarOperario(this.operario).subscribe(
        respuesta => {
          if (respuesta.esError) return;

          this.CONST.ocultarCargando();
          this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
          this.navegarAVerOperador();
        }
      );
    } else {
      this.operarioService.crearOperario(this.operario).subscribe(
        respuesta => {
          if (respuesta.esError) return;

          this.CONST.ocultarCargando();
          this.CONST.mostrarMensajeExitoso(respuesta.objeto.mensaje);
          this.navegarAVerOperador();
        }
      );
    }
  }

  navegarAListado() {
    this.router.navigate(['operarios/listado']);
  }

  navegarAVerOperador() {
    this.router.navigate(['operarios/ver/' + this.operario.identificacion]);
  }

  habilitarModoCreacion() {
    this.esModoCreacion = true;
    this.esModoEdicion = false;
    this.esModoLectura = false;
  }

  habilitarModoEdicion() {
    this.esModoCreacion = false;
    this.esModoEdicion = true;
    this.esModoLectura = false;
  }

  habilitarModoLectura() {
    this.esModoCreacion = false;
    this.esModoEdicion = false;
    this.esModoLectura = true;
  }

  cambiarEstado(value: string): void {
    this.btnRadioGroup.setValue({ radioEstado: value });
    this.operario.estado = value;
  }
}