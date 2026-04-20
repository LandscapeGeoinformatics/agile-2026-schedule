import { createRouter, createWebHashHistory } from 'vue-router'
import Welcome from '../pages/Welcome.vue'
import MainConference from '../pages/MainConference.vue'
import Workshops from '../pages/Workshops.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/main-conference', component: MainConference },
  { path: '/workshops', component: Workshops }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router