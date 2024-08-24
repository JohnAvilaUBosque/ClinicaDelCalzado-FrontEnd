import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ordenes de trabajo'
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
        path: 'ver/:id-orden',
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
        path: 'buscar/:id-orden-erroneo',
        loadComponent: () => import('./buscar-orden/buscar-orden.component').then(m => m.BuscarOrdenComponent),
        data: {
          title: 'Buscar'
        }
      },
      {
        path: 'borrar',
        loadComponent: () => import('./borrar-ordenes/borrar-ordenes.component').then(m => m.BorrarOrdenesComponent),
        data: {
          title: 'Borrar'
        }
      }
    ]
  }
];

