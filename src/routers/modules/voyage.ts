/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'
import boatIcon from '@/icons/svg/boat.svg'

const voyageRouter = [
  {
    path: '/voyage',
    component: Layout,
    redirect: '/voyage/voyageManage',
    name: 'voyage',
    meta: {
      title: '船次管理',
      icon: 'Ship'
    },
    children: [
      {
        path: '/voyage/voyageManage',
        component: () => import('@/views/voyage/voyageManage/index.vue'),
        name: 'voyageManage',
        meta: { title: '船次信息管理', svg: 'boat-info' },
      },
      {
        path: '/voyage/voyageAllocate',
        component: () => import('@/views/voyage/voyageAllocate/index.vue'),
        name: 'voyageAllocate',
        meta: { title: '船次智能分配', svg: 'boat-allocate' },
      },
    ],
  },
]

export default voyageRouter
