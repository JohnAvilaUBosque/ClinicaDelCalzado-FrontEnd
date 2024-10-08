import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from './views/usuarios/usuario.service';

export const authGuard: CanActivateFn = (route, state) => {
    const usuarioService = inject(UsuarioService);
    const router = inject(Router);

    if (usuarioService.obtenerAdminLocal()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};