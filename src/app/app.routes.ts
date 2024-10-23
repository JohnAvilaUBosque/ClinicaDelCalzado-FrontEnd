import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ordenesdetrabajo',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
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
        path: 'operarios',
        loadChildren: () => import('./views/operarios/routes').then((m) => m.routes)
      },
      {
        path: 'admins',
        loadChildren: () => import('./views/admins/routes').then((m) => m.routes)
      },
      {
        path: 'manual',
        loadChildren: () => import('./views/manual-de-usuario/routes').then((m) => m.routes)
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
    loadComponent: () => import('./views/usuarios/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login'
    }
  },
  {
    path: 'recuperacion',
    loadComponent: () => import('./views/usuarios/recuperacion/recuperacion.component').then(m => m.RecuperacionComponent),
    data: {
      title: 'Recuperacion'
    }
  },
  { path: '**', redirectTo: 'ordenesdetrabajo' }
];
