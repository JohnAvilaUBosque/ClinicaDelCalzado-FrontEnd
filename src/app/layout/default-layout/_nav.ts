import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Ordenes de trabajo',
  },
  {
    name: 'Listado ordenes de trabajo',
    url: '/ordenesdetrabajo/listado',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Crear orden de trabajo',
    url: '/ordenesdetrabajo/crear',
    iconComponent: { name: 'cil-notes' }
  },
  {
    name: 'Buscar orden de trabajo',
    url: '/ordenesdetrabajo/buscar',
    iconComponent: { name: 'cil-magnifying-glass' }
  },
  {
    name: 'Borrar ordenes de trabajo',
    url: '/ordenesdetrabajo/borrar',
    iconComponent: { name: 'cil-trash' }
  },
  {
    name: 'Informes',
    title: true
  },
  {
    name: 'Generar informe general',
    url: '/informes/general',
    iconComponent: { name: 'cil-chart-pie' }
  },
  {
    name: 'Generar informe detallado',
    url: '/informes/detallado',
    iconComponent: { name: 'cil-description' }
  },
  {
    title: true,
    name: 'Usuarios'
  },
  {
    name: 'Listado de administradores',
    url: '/usuarios/listado',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Agregar administrador',
    url: '/usuarios/agregar',
    iconComponent: { name: 'cil-user-follow' }
  }
];
