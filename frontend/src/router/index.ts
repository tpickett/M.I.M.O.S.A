// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/parts/list' },
  {
    path: '/parts',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: 'list',
        name: 'PartsList',
        component: () => import('@/views/Parts.vue'),
      }
    ],
  },
  {
    path: "/organizers",
    name: "Organizers",
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: 'list',
        name: 'OrganizerList',
        component: () => import('@/views/Organizers.vue'),
      },
      {
        path: ':id',
        name: 'organizer',
        component: () => import('@/views/SingleOrganizer.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
