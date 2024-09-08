import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { map } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-buscar-orden',
  standalone: true,
  imports: [CommonModule, CardModule, GridModule, ButtonModule, AlertModule, IconDirective, FormsModule, FormModule],
  templateUrl: './buscar-orden.component.html',
  styleUrl: './buscar-orden.component.scss'
})
export class BuscarOrdenComponent {

  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public constService = inject(ConstantsService);

  numeroOrden: string = "";
  alertVisible: boolean = false;
  numeroOrdenErroneo: string = "";

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.TITLE + ' - ' + 'Buscar orden de trabajo');
    
    this.route.params.pipe(map((p) => p['id-orden-erroneo'])).subscribe(

      idOrdenErroneo => {
        if (idOrdenErroneo) {
          this.numeroOrdenErroneo = idOrdenErroneo;
          this.alertVisible = true;
        }
      });
  }

  onSubmit() {
    this.router.navigate(['ordenesdetrabajo/ver/' + this.numeroOrden]);
  }
}
