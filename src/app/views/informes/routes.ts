import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Informes'
    },
    children: [
      {
        path: '',
        redirectTo: 'detallado',
        pathMatch: 'full'
      },
      {
        path: 'general',
        loadComponent: () => import('./informe-general/informe-general.component').then(m => m.InformeGeneralComponent),
        data: {
          title: 'General'
        }
      },
      {
        path: 'detallado',
        loadComponent: () => import('./informe-detallado/informe-detallado.component').then(m => m.InformeDetalladoComponent),
        data: {
          title: 'Detallado'
        }
      },
      { path: '**', redirectTo: 'detallado' }
    ]
  }
];

