import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manual-de-usuario.component').then(m => m.ManualDeUsuarioComponent),
    data: {
      title: 'Manual'
    }
  }
];

