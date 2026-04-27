import { createRouter, createWebHashHistory } from 'vue-router'
import Welcome from '../pages/Welcome.vue'
import DownloadSchedule from '../pages/DownloadSchedule.vue'
import MainConference from '../pages/MainConference.vue'
import Workshops from '../pages/Workshops.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/download-schedule', component: DownloadSchedule },
  { path: '/main-conference', component: MainConference },
  { path: '/workshops', component: Workshops }
]

// On github pages, we need to use hash mode for the router to work correctly with the base path.
//https://stackoverflow.com/questions/74483710/vue-router-with-hash-mode-doesnt-work-on-github-pages
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router