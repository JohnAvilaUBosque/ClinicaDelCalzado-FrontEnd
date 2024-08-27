import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonGroupComponent, ButtonModule, CardModule, FormCheckLabelDirective, FormModule, GridModule, TooltipModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AdministradorService } from '../administrador.service';
import { AdministradorModel } from '../administrador.model';
import { FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'formulario-admin',
  standalone: true,
  imports: [CommonModule, CardModule, FormModule, GridModule, ButtonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonGroupComponent, IconDirective, BadgeComponent, FormCheckLabelDirective],
  templateUrl: './formulario-admin.component.html',
  styleUrl: './formulario-admin.component.scss'
})
export class FormularioAdminComponent implements OnInit {

  private administradorService = inject(AdministradorService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public constService = inject(ConstantsService);

  public admin: AdministradorModel = new AdministradorModel();
  public esSoloLectura: boolean = false;
  public esModoEdicion: boolean = false;
  public titulo: string = '';

  ngOnInit(): void {
    const action = this.route.data.pipe(map((d) => d['title'])).subscribe(
      title => {
        this.titulo = title;
        if (title == 'Agregar') {
          this.admin.status = this.constService.ESTADO_ADMIN.ACTIVO;
        }
        else if (title == 'Editar') {
          this.habilitarModoEdicion();
          this.btnRadioGroup.setValue({ radio: this.admin.status });
        }
        else if (title == 'Ver') {
          this.deshabilitarModoEdicion();

          this.route.params.pipe(map((p) => p['id-admin'])).subscribe(
            idAdmin => {
              this.administradorService.obtenerAdministrador(idAdmin).subscribe(
                adminEncontrado => {
                  if (adminEncontrado) {
                    this.admin = adminEncontrado;
                    this.btnRadioGroup.setValue({ radio: this.admin.status });
                  }
                  else
                    this.router.navigate(['admins/listado']);
                }
              )
            }
          );
        }
      }
    );
  }

  onSubmit() {
    if (this.esModoEdicion) {
      this.administradorService.editarAdministrador(this.admin);
      this.deshabilitarModoEdicion();
    } else {
      this.administradorService.crearAdministrador(this.admin);
      this.router.navigate(['admins/ver/' + '123456789']); // TO DO: Hacer esto dentro del suscribe del crear admin
    }
  }

  habilitarModoEdicion() {
    this.titulo = 'Editar';
    this.esModoEdicion = true;
    this.esSoloLectura = false;
  }

  deshabilitarModoEdicion() {
    this.titulo = 'Ver';
    this.esSoloLectura = true;
    this.esModoEdicion = false;
  }

  btnRadioGroup = this.formBuilder.group({
    radio: new FormControl(this.constService.ESTADO_ADMIN.ACTIVO.toString())
  });

  cambiarEstado(value: string): void {
    this.btnRadioGroup.setValue({ radio: value });
    this.admin.status = value;
  }

}