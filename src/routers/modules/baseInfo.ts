/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const baseInfoRouter = [
  {
    menuId: 3,
    path: '/baseInfo',
    component: Layout,
    redirect: '/baseInfo/userInfo',
    name: 'baseInfo',
    meta: {
      title: '基本信息',
      icon: 'Document',
    },
    children: [
      {
        menuId: 17,
        parentId: 3,
        path: '/baseInfo/userInfo',
        component: () => import('@/views/baseInfo/userInfo/index.vue'),
        name: 'userInfo',
        meta: { title: '员工信息', svg: 'user-info', keepAlive: true },
      },
      {
        menuId: 18,
        parentId: 3,
        path: '/baseInfo/shipInfo',
        component: () => import('@/views/baseInfo/shipInfo/index.vue'),
        name: 'shipInfo',
        meta: { title: '船只信息', svg: 'boat', keepAlive: true },
      },
      {
        menuId: 19,
        parentId: 3,
        path: '/baseInfo/travelInfo',
        component: () => import('@/views/baseInfo/travelInfo/index.vue'),
        name: 'travelInfo',
        meta: { title: '旅行社信息', svg: 'travel-info', keepAlive: true },
      },
      {
        menuId: 20,
        parentId: 3,
        path: '/baseInfo/travellerInfo',
        component: () => import('@/views/baseInfo/travellerInfo/index.vue'),
        name: 'travellerInfo',
        meta: { title: '旅客信息', svg: 'traveller-info', keepAlive: true },
      },
    ],
  },
]

export default baseInfoRouter
