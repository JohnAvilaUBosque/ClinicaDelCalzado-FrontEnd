import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admins'
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
        loadComponent: () => import('./formulario-admin/formulario-admin.component').then(m => m.FormularioAdminComponent),
        data: {
          title: 'Agregar'
        }
      },
      {
        path: 'editar',
        loadComponent: () => import('./formulario-admin/formulario-admin.component').then(m => m.FormularioAdminComponent),
        data: {
          title: 'Editar'
        }
      },
      {
        path: 'ver',
        loadComponent: () => import('./formulario-admin/formulario-admin.component').then(m => m.FormularioAdminComponent),
        data: {
          title: 'Ver'
        }
      },
      {
        path: 'ver/:id-orden',
        loadComponent: () => import('./formulario-admin/formulario-admin.component').then(m => m.FormularioAdminComponent),
        data: {
          title: 'Ver'
        }
      },
    ]
  }
];
