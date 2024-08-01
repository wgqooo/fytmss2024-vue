/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemRouter = [
  {
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
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue'),
        name: 'role',
        meta: { title: '权限管理', svg: 'authority' },
      },
      {
        path: '/system/dictionary',
        component: () => import('@/views/system/dictionary/index.vue'),
        name: 'dictionary',
        meta: { title: '系统参数', svg: 'sys-params' },
      },
      {
        path: '/system/inform',
        component: () => import('@/views/system/inform/index.vue'),
        name: 'inform',
        meta: { title: '通知管理', icon: 'MenuIcon' },
      },
      {
        path: '/system/menu',
        component: () => import('@/views/system/menu/index.vue'),
        name: 'menu',
        meta: { title: '菜单管理', icon: 'MenuIcon' },
      },
      {
        path: '/system/password',
        component: () => import('@/views/system/password/index.vue'),
        name: 'menu',
        meta: { title: '密码管理', icon: 'MenuIcon' },
      },
    ],
  },
]

export default systemRouter
