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
        loadComponent: () => import('./crear-orden/crear-orden.component').then(m => m.CrearOrdenComponent),
        data: {
          title: 'Crear'
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
        path: 'ver/:id-orden',
        loadComponent: () => import('./crear-orden/crear-orden.component').then(m => m.CrearOrdenComponent),
        data: {
          title: 'Ver'
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

