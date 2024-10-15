import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Operarios'
    },
    children: [
      {
        path: '',
        redirectTo: 'listado',
        pathMatch: 'full'
      },
      {
        path: 'listado',
        loadComponent: () => import('./listado-operarios/listado-operarios.component').then(m => m.ListadoOperariosComponent),
        data: {
          title: 'Listado'
        }
      },
      {
        path: 'agregar',
        loadComponent: () => import('./formulario-operario/formulario-operario.component').then(m => m.FormularioOperarioComponent),
        data: {
          title: 'Agregar'
        }
      },
      {
        path: 'editar/:id-operario',
        loadComponent: () => import('./formulario-operario/formulario-operario.component').then(m => m.FormularioOperarioComponent),
        data: {
          title: 'Editar'
        }
      },
      {
        path: 'ver/:id-operario',
        loadComponent: () => import('./formulario-operario/formulario-operario.component').then(m => m.FormularioOperarioComponent),
        data: {
          title: 'Ver'
        }
      },
      { path: '**', redirectTo: 'listado' }
    ]
  }
];
