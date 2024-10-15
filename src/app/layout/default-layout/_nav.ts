import { INavData } from '@coreui/angular';
import { ROL_ADMIN } from '../../globals';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Órdenes de trabajo',
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL, ROL_ADMIN.SECUNDARIO]
    }
  },
  {
    name: 'Listado órdenes de trabajo',
    url: '/ordenesdetrabajo/listado',
    iconComponent: { name: 'cil-list' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL, ROL_ADMIN.SECUNDARIO]
    }
  },
  {
    name: 'Crear orden de trabajo',
    url: '/ordenesdetrabajo/crear',
    iconComponent: { name: 'cil-note-add' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL, ROL_ADMIN.SECUNDARIO]
    }
  },
  {
    name: 'Buscar orden de trabajo',
    url: '/ordenesdetrabajo/buscar',
    iconComponent: { name: 'cil-magnifying-glass' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL, ROL_ADMIN.SECUNDARIO]
    }
  },
  {
    title: true,
    name: 'Informes',
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    name: 'Generar informe general',
    url: '/informes/general',
    iconComponent: { name: 'cil-chart' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    name: 'Generar informe detallado',
    url: '/informes/detallado',
    iconComponent: { name: 'cil-description' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    title: true,
    name: 'Operarios',
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    name: 'Listado de operarios',
    url: '/operarios/listado',
    iconComponent: { name: 'cil-people' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    name: 'Agregar operario',
    url: '/operarios/agregar',
    iconComponent: { name: 'cil-user-plus' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    title: true,
    name: 'Administradores',
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    name: 'Listado de administradores',
    url: '/admins/listado',
    iconComponent: { name: 'cil-people' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  },
  {
    name: 'Agregar administrador',
    url: '/admins/agregar',
    iconComponent: { name: 'cil-user-plus' },
    attributes: {
      'rolesAutorizados': [ROL_ADMIN.PRINCIPAL]
    }
  }
];
