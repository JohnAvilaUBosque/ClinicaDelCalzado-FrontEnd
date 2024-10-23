import { Component, computed, DestroyRef, inject, Input } from '@angular/core';
import {
  ColorModeService,
  ContainerComponent,
  DropdownModule,
  HeaderComponent,
  HeaderModule,
  SidebarToggleDirective
} from '@coreui/angular';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/base.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [DropdownModule, ContainerComponent, HeaderModule, SidebarToggleDirective, IconDirective, NgTemplateOutlet,]
})
export class DefaultHeaderComponent extends HeaderComponent {

  private router = inject(Router);
  private baseService = inject(BaseService);

  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor() {
    super();
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  @Input() sidebarId: string = 'sidebar1';

  cerrarSesion() {
    this.baseService.cerrarSesion();
    this.router.navigate(['login']);
  }

  navegarAPerfil() {
    this.router.navigate(['admins/perfil']);
  }

  navegarAManual() {
    this.router.navigate(['manual']);
  }

}
