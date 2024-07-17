/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const financeRouter = [
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/carryDetails',
    name: 'finance',
    meta: {
      title: '财务明细',
      icon: 'List',
    },
    children: [
      {
        path: '/finance/carryDetails',
        component: () => import('@/views/finance/carryDetails/index.vue'),
        name: 'carryDetails',
        meta: { title: '载客日统计查询', svg: 'carry-details' },
      },
      {
        path: '/finance/refundDetails',
        component: () => import('@/views/finance/refundDetails/index.vue'),
        name: 'refundDetails',
        meta: { title: '退票明细', svg: 'refund-details' },
      },
      {
        path: '/finance/changeDetails',
        component: () => import('@/views/finance/changeDetails/index.vue'),
        name: 'changeDetails',
        meta: { title: '改签明细', svg: 'change-details' },
      },
      {
        path: '/finance/voyageDatails',
        component: () => import('@/views/finance/voyageDatails/index.vue'),
        name: 'voyageDatails',
        meta: { title: '国内船航次统计', svg: 'voyage-details' },
      },
      {
        path: '/finance/touristDetails',
        component: () => import('@/views/finance/touristDetails/index.vue'),
        name: 'touristDetails',
        meta: { title: '散客售票日志', svg: 'tourist-details' },
      },
      {
        path: '/finance/borderDetails',
        component: () => import('@/views/finance/borderDetails/index.vue'),
        name: 'borderDetails',
        meta: { title: '出入境游客明细', svg: 'border-details' },
      },
    ],
  },
]

export default financeRouter
