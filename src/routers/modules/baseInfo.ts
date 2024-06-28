/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const baseInfoRouter = [
  {
    path: '/base-info',
    component: Layout,
    redirect: '/base-info/userInfo',
    name: 'base-info',
    meta: {
      title: '基本信息',
      icon: 'Document',
    },
    children: [
      {
        path: '/base-info/userInfo',
        component: () => import('@/views/baseInfo/userInfo/index.vue'),
        name: 'userInfo',
        meta: { title: '员工信息', svg: 'user-info' },
      },
      {
        path: '/base-info/shipInfo',
        component: () => import('@/views/baseInfo/shipInfo/index.vue'),
        name: 'shipInfo',
        meta: { title: '船只管理', svg: 'boat' },
      },
      {
        path: '/base-info/travelInfo',
        component: () => import('@/views/baseInfo/travelInfo/index.vue'),
        name: 'travelInfo',
        meta: { title: '旅行社信息', svg: 'travel-info' },
      },
      {
        path: '/base-info/travellerInfo',
        component: () => import('@/views/baseInfo/travellerInfo/index.vue'),
        name: 'travellerInfo',
        meta: { title: '旅客信息', svg: 'traveller-info' },
      },
      {
        path: '/base-info/dictionary',
        component: () => import('@/views/baseInfo/dictionary/index.vue'),
        name: 'dictionary',
        meta: { title: '字典管理', icon: 'Reading' },
      },
    ],
  },
]

export default baseInfoRouter
