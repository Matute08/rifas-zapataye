<template>
  <div class="cargar-rifas-container">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Cargar Rifas</h1>
            <p class="text-gray-800 mt-2">Gestiona las rifas vendidas para el sorteo</p>
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card variant="gradient" padding="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalRifas }}</p>
            <p class="text-sm text-gray-700">Total Rifas</p>
          </div>
        </Card>
        <Card variant="gradient" padding="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.rifasVendidas }}</p>
            <p class="text-sm text-gray-700">Rifas Vendidas</p>
          </div>
        </Card>
        <Card variant="gradient" padding="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.rifasGanadas }}</p>
            <p class="text-sm text-gray-700">Rifas Ganadas</p>
          </div>
        </Card>
        <Card variant="gradient" padding="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.rifasPendientes }}</p>
            <p class="text-sm text-gray-700">Rifas Pendientes</p>
          </div>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario -->
        <div class="lg:col-span-1">
          <RifaForm />
        </div>

        <!-- Lista de Rifas -->
        <div class="lg:col-span-2">
          <RifaList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRifaStore } from '../stores/rifaStore'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import RifaForm from '../components/rifa/RifaForm.vue'
import RifaList from '../components/rifa/RifaList.vue'

const rifaStore = useRifaStore()

// Computed
const estadisticas = computed(() => ({
  totalRifas: rifaStore.totalRifas,
  rifasVendidas: rifaStore.rifasVendidas,
  rifasGanadas: rifaStore.rifasGanadas,
  rifasPendientes: rifaStore.rifasPendientes
}))
</script>

<style scoped>
.cargar-rifas-container {
  min-height: 100vh;
  background-color: #c6c8ca; /* Cambia este valor por el color que quieras probar */
}
</style>
