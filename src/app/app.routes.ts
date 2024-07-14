import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ordenesdetrabajo',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'ordenesdetrabajo',
        loadChildren: () => import('./views/ordenes-de-trabajo/routes').then((m) => m.routes)
      },
      {
        path: 'informes',
        loadChildren: () => import('./views/informes/routes').then((m) => m.routes)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./views/usuarios/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  { path: '**', redirectTo: 'ordenesdetrabajo' }
];
