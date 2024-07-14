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
        redirectTo: 'general',
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
        loadComponent: () => import('./informe-especifico/informe-especifico.component').then(m => m.InformeEspecificoComponent),
        data: {
          title: 'Detallado'
        }
      }
    ]
  }
];

