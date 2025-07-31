<template>
  <Card variant="elevated" padding="lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-900">Lista de Rifas</h3>
        <div class="flex items-center space-x-3">
          <!-- Búsqueda -->
          <div class="relative">
            <input
              v-model="terminoBusqueda"
              type="text"
              placeholder="Buscar rifas..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      <!-- Selección múltiple -->
      <div class="flex items-center mt-4 mb-2">
        <input type="checkbox" v-model="todasSeleccionadas" class="mr-2" />
        <span class="mr-4">Seleccionar todas</span>
        <Button variant="danger" :disabled="seleccionadas.length === 0" @click="eliminarSeleccionadas">
          Eliminar seleccionadas
        </Button>
      </div>
    </template>

    <!-- Lista de Rifas -->
    <div v-if="rifasPagina.length > 0" class="space-y-4">
      <div
        v-for="rifa in rifasPagina"
        :key="rifa.id"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        :class="{ 'bg-green-50 border-green-200': esGanadora(rifa.numero) }"
      >
        <div class="flex items-center space-x-4">
          <!-- Checkbox individual -->
          <input type="checkbox" :value="rifa.id" v-model="seleccionadas" class="mr-2" />
          <!-- Número de Rifa -->
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-sm">{{ rifa.numero }}</span>
          </div>
          <!-- Información -->
          <div>
            <h4 class="font-semibold text-gray-900">{{ rifa.comprador }}</h4>
            <p class="text-sm text-gray-600">Vendido por: {{ rifa.vendedor }}</p>
          </div>
        </div>
        <!-- Estado y Acciones -->
        <div class="flex items-center space-x-3">
          <!-- Estado -->
          <div v-if="esGanadora(rifa.numero)" class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm text-green-600 font-medium">Ganadora</span>
          </div>
          <div v-else class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-sm text-blue-600 font-medium">Disponible</span>
          </div>
          <!-- Acciones -->
          <div class="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              @click="verDetalles(rifa)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </Button>
            <Button
              v-if="!esGanadora(rifa.numero)"
              variant="ghost"
              size="sm"
              @click="eliminarRifa(rifa.id)"
            >
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-if="rifasFiltradas.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay rifas</h3>
      <p class="text-gray-500">
        {{ terminoBusqueda || filtroEstado ? 'No se encontraron rifas con los filtros aplicados' : 'Agrega tu primera rifa para comenzar' }}
      </p>
    </div>

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-700">
        Mostrando {{ inicioPagina + 1 }} a {{ finPagina }} de {{ rifasFiltradas.length }} rifas
      </div>
      
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="paginaActual === 1"
          @click="paginaActual--"
        >
          Anterior
        </Button>
        
        <span class="text-sm text-gray-700">
          Página {{ paginaActual }} de {{ totalPaginas }}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          :disabled="paginaActual === totalPaginas"
          @click="paginaActual++"
        >
          Siguiente
        </Button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <Modal v-model="mostrarDetalles" title="Detalles de la Rifa" size="md">
      <div v-if="rifaSeleccionada" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Número</label>
            <p class="text-lg font-semibold text-gray-900">{{ rifaSeleccionada.numero }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <p class="text-lg font-semibold" :class="esGanadora(rifaSeleccionada.numero) ? 'text-green-600' : 'text-blue-600'">
              {{ esGanadora(rifaSeleccionada.numero) ? 'Ganadora' : 'Disponible' }}
            </p>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Comprador</label>
          <p class="text-lg font-semibold text-gray-900">{{ rifaSeleccionada.comprador }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Vendedor</label>
          <p class="text-lg font-semibold text-gray-900">{{ rifaSeleccionada.vendedor }}</p>
        </div>
        
        
      </div>
      
      <template #footer>
        <Button variant="outline" @click="mostrarDetalles = false">
          Cerrar
        </Button>
      </template>
    </Modal>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRifaStore } from '../../stores/rifaStore'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'
import Swal from 'sweetalert2'

const rifaStore = useRifaStore()

// Estado
const terminoBusqueda = ref('')
const filtroEstado = ref('')
const paginaActual = ref(1)
const rifasPorPagina = 10
const mostrarDetalles = ref(false)
const rifaSeleccionada = ref(null)
const seleccionadas = ref([])

// Computed
const rifasFiltradas = computed(() => {
  let rifas = rifaStore.rifas

  // Aplicar búsqueda
  if (terminoBusqueda.value) {
    rifas = rifaStore.buscarRifas(terminoBusqueda.value)
  }

  // Aplicar filtro de estado
  if (filtroEstado.value === 'disponible') {
    rifas = rifas.filter(rifa => !esGanadora(rifa.numero))
  } else if (filtroEstado.value === 'ganada') {
    rifas = rifas.filter(rifa => esGanadora(rifa.numero))
  }

  return rifas
})

const totalPaginas = computed(() => {
  return Math.ceil(rifasFiltradas.value.length / rifasPorPagina)
})

const inicioPagina = computed(() => {
  return (paginaActual.value - 1) * rifasPorPagina
})

const finPagina = computed(() => {
  return Math.min(inicioPagina.value + rifasPorPagina, rifasFiltradas.value.length)
})

const rifasPagina = computed(() => {
  return rifasFiltradas.value.slice(inicioPagina.value, finPagina.value)
})

const todasSeleccionadas = computed({
  get() {
    return rifasPagina.value.length > 0 && rifasPagina.value.every(r => seleccionadas.value.includes(r.id))
  },
  set(valor) {
    if (valor) {
      seleccionadas.value = rifasPagina.value.map(r => r.id)
    } else {
      seleccionadas.value = []
    }
  }
})

const toggleSeleccion = (id) => {
  if (seleccionadas.value.includes(id)) {
    seleccionadas.value = seleccionadas.value.filter(sid => sid !== id)
  } else {
    seleccionadas.value.push(id)
  }
}

const eliminarSeleccionadas = () => {
  if (seleccionadas.value.length === 0) return
  Swal.fire({
    title: '¿Eliminar rifas seleccionadas?',
    text: `Se eliminarán ${seleccionadas.value.length} rifas. ¿Estás seguro?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      seleccionadas.value.forEach(id => rifaStore.eliminarRifa(id))
      seleccionadas.value = []
      Swal.fire('Eliminadas', 'Las rifas seleccionadas han sido eliminadas.', 'success')
    }
  })
}

// Métodos
const esGanadora = (numero) => {
  return rifaStore.rifasGanadoras.some(ganadora => ganadora.numero === numero)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const verDetalles = (rifa) => {
  rifaSeleccionada.value = rifa
  mostrarDetalles.value = true
}

const eliminarRifa = (id) => {
  const rifa = rifaStore.rifas.find(r => r.id === id)
  if (!rifa) return
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Estás seguro de que quieres eliminar la rifa ${rifa.numero}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      rifaStore.eliminarRifa(id)
      Swal.fire('Eliminada', 'La rifa ha sido eliminada.', 'success')
    }
  })
}

// Resetear página cuando cambian los filtros
const resetearPagina = () => {
  paginaActual.value = 1
}

// Watchers
import { watch } from 'vue'

watch(terminoBusqueda, resetearPagina)
watch(filtroEstado, resetearPagina)
</script> 