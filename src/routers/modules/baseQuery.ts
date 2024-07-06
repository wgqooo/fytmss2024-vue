/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const baseQueryRouter = [
  {
    path: '/baseQuery',
    component: Layout,
    redirect: '/baseQuery/teamQuery',
    name: 'baseQuery',
    meta: {
      title: '基本查询',
      icon: 'Filter',
    },
    children: [
      {
        path: '/baseQuery/teamQuery',
        component: () => import('@/views/baseQuery/teamQuery/index.vue'),
        name: 'teamQuery',
        meta: { title: '团信息查询', svg: 'query-team' },
      },
      {
        path: '/baseQuery/ticketQuery',
        component: () => import('@/views/baseQuery/ticketQuery/index.vue'),
        name: 'ticketQuery',
        meta: { title: '船票信息查询', svg: 'query-ticket' },
      },
      {
        path: '/baseQuery/travellerQuery',
        component: () => import('@/views/baseQuery/travellerQuery/index.vue'),
        name: 'travellerQuery',
        meta: { title: '旅客信息查询', svg: 'query-traveller' },
      },
      {
        path: '/baseQuery/carryQuery',
        component: () => import('@/views/baseQuery/carryQuery/index.vue'),
        name: 'carryQuery',
        meta: { title: '运载信息查询', svg: 'query-carry' },
      },
    ],
  },
]

export default baseQueryRouter
