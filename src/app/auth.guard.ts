import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { navItems } from './layout/default-layout/_nav';
import { isString } from 'lodash-es';
import { ConstantsService } from './constants.service';

export const authGuard: CanActivateFn = (route, state) => {
    const baseService = inject(BaseService);
    const router = inject(Router);
    const CONST = inject(ConstantsService);

    var adminLocal = baseService.obtenerAdminLocal();

    if (!adminLocal || !baseService.obtenerToken()) {
        baseService.cerrarSesion();
        router.navigate(['/login']);
        return false;
    }

    var nav = navItems.find(n => isString(n.url) ? state.url.includes(n.url) : false);
    var rolesAutorizados: Array<string> = nav?.attributes!['rolesAutorizados'] || [];

    if (nav && !rolesAutorizados.includes(adminLocal.rol)) {
        CONST.mostrarMensajeError('No tiene permisos para acceder a este recurso.');
        router.navigate(['']);
        return false;
    }

    return true;
};