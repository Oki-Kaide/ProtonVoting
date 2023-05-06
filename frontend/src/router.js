import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home'
import Vote from './views/Vote'
import Results from './views/Results'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/vote/:id', name: 'Vote', component: Vote, props: true },
  { path: '/results/:id', name: 'Results', component: Results, props: true }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})