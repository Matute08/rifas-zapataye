import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import CargarRifas from '../pages/CargarRifas.vue'
import CargarPremios from '../pages/CargarPremios.vue'
import Sorteo from '../pages/Sorteo.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/rifas', component: CargarRifas },
  { path: '/premios', component: CargarPremios },
  { path: '/sorteo', component: Sorteo }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
