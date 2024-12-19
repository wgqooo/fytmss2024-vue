/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
  {
    menuId: 2,
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        menuId: 12,
        parentId: 2,
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue'),
        name: 'role',
        meta: { title: '权限管理', svg: 'authority', keepAlive: true },
      },
      {
        menuId: 13,
        parentId: 2,
        path: '/system/dictionary',
        component: () => import('@/views/system/dictionary/index.vue'),
        name: 'dictionary',
        meta: { title: '系统参数', svg: 'sys-params', keepAlive: true },
      },
      {
        menuId: 14,
        parentId: 2,
        path: '/system/inform',
        component: () => import('@/views/system/inform/index.vue'),
        name: 'inform',
        meta: { title: '通知管理', svg: 'sys-inform', keepAlive: true },
      },
      {
        menuId: 15,
        parentId: 2,
        path: '/system/menu',
        component: () => import('@/views/system/menu/index.vue'),
        name: 'menu',
        meta: { title: '菜单管理', svg: 'sys-menu', keepAlive: true },
      },
      {
        menuId: 16,
        parentId: 2,
        path: '/system/password',
        component: () => import('@/views/system/password/index.vue'),
        name: 'password',
        meta: { title: '密码管理', svg: 'sys-pwd', keepAlive: true },
      },
    ],
  },
]

export default systemRouter
