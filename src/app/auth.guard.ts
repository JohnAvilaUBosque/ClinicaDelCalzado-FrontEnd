import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from './base.service';

export const authGuard: CanActivateFn = (route, state) => {
    const baseService = inject(BaseService);
    const router = inject(Router);

    if (baseService.obtenerAdminLocal() && baseService.obtenerToken()) {
        return true;
    } else {
        baseService.cerrarSesion();
        router.navigate(['/login']);
        return false;
    }
};