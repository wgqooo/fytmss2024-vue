/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const baseInfoRouter = [
  {
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
        path: '/baseInfo/userInfo',
        component: () => import('@/views/baseInfo/userInfo/index.vue'),
        name: 'userInfo',
        meta: { title: '员工信息', svg: 'user-info' },
      },
      {
        path: '/baseInfo/shipInfo',
        component: () => import('@/views/baseInfo/shipInfo/index.vue'),
        name: 'shipInfo',
        meta: { title: '船只信息', svg: 'boat' },
      },
      {
        path: '/baseInfo/travelInfo',
        component: () => import('@/views/baseInfo/travelInfo/index.vue'),
        name: 'travelInfo',
        meta: { title: '旅行社信息', svg: 'travel-info' },
      },
      {
        path: '/baseInfo/travellerInfo',
        component: () => import('@/views/baseInfo/travellerInfo/index.vue'),
        name: 'travellerInfo',
        meta: { title: '旅客信息', svg: 'traveller-info' },
      },
    ],
  },
]

export default baseInfoRouter
