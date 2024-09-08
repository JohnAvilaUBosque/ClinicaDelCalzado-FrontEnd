import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Órdenes de trabajo',
  },
  {
    name: 'Listado órdenes de trabajo',
    url: '/ordenesdetrabajo/listado',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Crear orden de trabajo',
    url: '/ordenesdetrabajo/crear',
    iconComponent: { name: 'cil-note-add' }
  },
  {
    name: 'Buscar orden de trabajo',
    url: '/ordenesdetrabajo/buscar',
    iconComponent: { name: 'cil-magnifying-glass' }
  },
  {
    name: 'Borrar órdenes de trabajo',
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
    iconComponent: { name: 'cil-chart' }
  },
  {
    name: 'Generar informe detallado',
    url: '/informes/detallado',
    iconComponent: { name: 'cil-description' }
  },
  {
    title: true,
    name: 'Administradores'
  },
  {
    name: 'Listado de administradores',
    url: '/admins/listado',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Agregar administrador',
    url: '/admins/agregar',
    iconComponent: { name: 'cil-user-plus' }
  }
];
