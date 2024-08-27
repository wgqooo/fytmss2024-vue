/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const baseQueryRouter = [
  {
    menuId: 6,
    path: '/baseQuery',
    component: Layout,
    redirect: '/baseQuery/teamQuery',
    name: 'baseQuery',
    meta: {
      title: '基本查询',
      icon: 'Filter',
      keepAlive: true,
    },
    children: [
      {
        menuId: 27,
        parentId: 6,
        path: '/baseQuery/teamQuery',
        component: () => import('@/views/baseQuery/teamQuery/index.vue'),
        name: 'teamQuery',
        meta: { title: '团信息查询', svg: 'query-team', keepAlive: true },
      },
      {
        menuId: 28,
        parentId: 6,
        path: '/baseQuery/ticketQuery',
        component: () => import('@/views/baseQuery/ticketQuery/index.vue'),
        name: 'ticketQuery',
        meta: { title: '船票信息查询', svg: 'query-ticket', keepAlive: true },
      },
      {
        menuId: 29,
        parentId: 6,
        path: '/baseQuery/travellerQuery',
        component: () => import('@/views/baseQuery/travellerQuery/index.vue'),
        name: 'travellerQuery',
        meta: { title: '旅客信息查询', svg: 'query-traveller', keepAlive: true },
      },
      {
        menuId: 30,
        parentId: 6,
        path: '/baseQuery/carryQuery',
        component: () => import('@/views/baseQuery/carryQuery/index.vue'),
        name: 'carryQuery',
        meta: { title: '运载信息查询', svg: 'query-carry', keepAlive: true },
      },
    ],
  },
]

export default baseQueryRouter
