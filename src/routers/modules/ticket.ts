/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const ticketRouter = [
  {
    path: '/ticket',
    component: Layout,
    redirect: '/ticket/touristTicket',
    name: 'ticket',
    meta: {
      title: '票务功能',
      icon: 'Ticket',
    },
    children: [
      {
        path: '/ticket/touristTicket',
        component: () => import('@/views/ticket/touristTicket/index.vue'),
        name: 'touristTicket',
        meta: { title: '散客购票', svg: 'touristTicket' },
      },
      {
        path: '/ticket/touristOrder',
        component: () => import('@/views/ticket/touristOrder/index.vue'),
        name: 'touristOrder',
        meta: { title: '散客订单', svg: 'touristOrder' },
      },
      {
        path: '/ticket/teamTicket',
        component: () => import('@/views/ticket/teamTicket/index.vue'),
        name: 'teamTicket',
        meta: { title: '团体购票', svg: 'teamTicket' },
      },
      {
        path: '/ticket/teamOrder',
        component: () => import('@/views/ticket/teamOrder/index.vue'),
        name: 'teamOrder',
        meta: { title: '团体订单', svg: 'teamOrder' },
      },
    ],
  },
]

export default ticketRouter
