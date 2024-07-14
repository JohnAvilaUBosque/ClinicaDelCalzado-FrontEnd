import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Usuarios'
    },
    children: [
      {
        path: '',
        redirectTo: 'listado',
        pathMatch: 'full'
      },
      {
        path: 'listado',
        loadComponent: () => import('./listado-admins/listado-admins.component').then(m => m.ListadoAdminsComponent),
        data: {
          title: 'Listado'
        }
      },
      {
        path: 'agregar',
        loadComponent: () => import('./agregar-admin/agregar-admin.component').then(m => m.AgregarAdminComponent),
        data: {
          title: 'Agregar'
        }
      }
    ]
  }
];
