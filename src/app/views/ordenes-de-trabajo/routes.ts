import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Órdenes de trabajo'
    },
    children: [
      {
        path: '',
        redirectTo: 'listado',
        pathMatch: 'full'
      },
      {
        path: 'listado',
        loadComponent: () => import('./listado-ordenes/listado-ordenes.component').then(m => m.ListadoOrdenesComponent),
        data: {
          title: 'Listado'
        }
      },
      {
        path: 'crear',
        loadComponent: () => import('./formulario-orden/formulario-orden.component').then(m => m.FormularioOrdenComponent),
        data: {
          title: 'Crear'
        }
      },
      {
        path: 'ver/:numero-orden',
        loadComponent: () => import('./formulario-orden/formulario-orden.component').then(m => m.FormularioOrdenComponent),
        data: {
          title: 'Ver'
        }
      },
      {
        path: 'buscar',
        loadComponent: () => import('./buscar-orden/buscar-orden.component').then(m => m.BuscarOrdenComponent),
        data: {
          title: 'Buscar'
        }
      },
      {
        path: 'migrar',
        loadComponent: () => import('./formulario-orden/formulario-orden.component').then(m => m.FormularioOrdenComponent),
        data: {
          title: 'Migrar'
        }
      },
      { path: '**', redirectTo: 'listado' }
    ]
  }
];

