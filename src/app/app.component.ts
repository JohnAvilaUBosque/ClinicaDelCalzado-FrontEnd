import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { ModalComponent, ModalModule, SpinnerModule, ToastComponent, ToastModule } from '@coreui/angular';
import { ConstantsService } from './constants.service';
import { ErrorInterceptor } from './error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IconModule, ToastModule, ModalModule, SpinnerModule],
  providers: [
    IconSetService,
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

  private CONST = inject(ConstantsService);

  public mensajeError: string = '';
  public mensajeExitoso: string = '';

  @ViewChild('toastError') toastError!: ToastComponent;
  @ViewChild('toastExitoso') toastExitoso!: ToastComponent;
  @ViewChild('cargandoModal') cargandoModal!: ModalComponent;

  constructor(
    private router: Router,
    public iconSetService: IconSetService
  ) {
    iconSetService.icons = freeSet;
  }

  ngOnInit(): void {
    this.CONST.mensajeErrorEvento$.subscribe(error => {
      this.mensajeError = error;
      this.toastError.visible = true;
    });

    this.CONST.mensajeExitosoEvento$.subscribe(mensaje => {
      this.mensajeExitoso = mensaje;
      this.toastExitoso.visible = true;
    });

    this.CONST.cargandoEvento$.subscribe(valor => {
      this.cargandoModal.visible = valor;
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  ngAfterViewInit(): void {
    this.cargandoModal.visible = false;
  }
}
