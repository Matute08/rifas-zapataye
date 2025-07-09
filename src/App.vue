<template>
  <div id="app">
    <img src="./assets/ZapatayeSinFondo.png" alt="Logo" class="logo-fixed" />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Footer from './components/ui/Footer.vue'
// El componente App ahora solo maneja el router
</script>

<style>
.logo-fixed {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 120px;
  height: auto;
  z-index: 1000;
  opacity: 0.95;
}
@media (max-width: 640px) {
  .logo-fixed {
    width: 60px;
    top: 12px;
    left: 12px;
  }
}
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
