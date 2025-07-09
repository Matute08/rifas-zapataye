<template>
  <div class="cargar-premios-container">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Cargar Premios</h1>
            <p class="text-gray-800 mt-2">Gestiona los premios disponibles para el sorteo</p>
          </div>
          <Button 
            variant="outline" 
            @click="$router.push('/')"
          >
            <template #icon-left>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </template>
            Volver
          </Button>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <Card variant="gradient" padding="sm">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalPremios }}</p>
              <p class="text-sm text-gray-700">Total Premios</p>
            </div>
          </Card>
          <Card variant="gradient" padding="sm">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ estadisticas.premiosPendientes }}</p>
              <p class="text-sm text-gray-700">Premios Pendientes</p>
            </div>
          </Card>
          <Card variant="gradient" padding="sm">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ estadisticas.premiosSorteados }}</p>
              <p class="text-sm text-gray-700">Premios Sorteados</p>
            </div>
          </Card>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario -->
        <div class="lg:col-span-1">
          <PremioForm />
        </div>

        <!-- Lista de Premios -->
        <div class="lg:col-span-2">
          <PremioList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePremioStore } from '../stores/premioStore'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import PremioForm from '../components/premio/PremioForm.vue'
import PremioList from '../components/premio/PremioList.vue'

const premioStore = usePremioStore()

// Computed
const estadisticas = computed(() => ({
  totalPremios: premioStore.totalPremios,
  premiosPendientes: premioStore.premiosPendientes,
  premiosSorteados: premioStore.premiosSorteadosCount
}))

const valorTotal = computed(() => {
  return premioStore.premios.reduce((total, premio) => total + premio.valor, 0)
})
</script>

<style scoped>


.cargar-premios-container {
  min-height: 100vh;
  background-color: #c6c8ca; /* Cambia este valor por el color que quieras probar */
}
</style>
