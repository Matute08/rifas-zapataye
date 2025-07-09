<template>
  <div class="home-container">
    <!-- Header -->
    <div class="header-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center py-12">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Sistema de Sorteo de Rifas 
          </h1>
          <p class="text-xl text-gray-800 mb-8">
            Zapataye Fútbol Club
          </p>
          
          <!-- Estadísticas Rápidas -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card variant="gradient" padding="sm">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 mb-2">{{ estadisticas.totalRifas }}</div>
                <div class="text-sm text-gray-700">Total Rifas</div>
              </div>
            </Card>
            <Card variant="gradient" padding="sm">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 mb-2">{{ estadisticas.rifasGanadas }}</div>
                <div class="text-sm text-gray-700">Rifas Ganadas</div>
              </div>
            </Card>
            <Card variant="gradient" padding="sm">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 mb-2">{{ estadisticas.totalPremios }}</div>
                <div class="text-sm text-gray-700">Total Premios</div>
              </div>
            </Card>
            <Card variant="gradient" padding="sm">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 mb-2">{{ estadisticas.premiosSorteados }}</div>
                <div class="text-sm text-gray-700">Premios Sorteados</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Principales -->
    <div class="actions-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Cargar Rifas -->
          <Card variant="elevated" padding="lg" hover>
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Cargar Rifas</h3>
              <p class="text-gray-600 mb-6">
                Agrega las rifas vendidas con información del vendedor y comprador
              </p>
              <Button 
                variant="primary" 
                size="lg"
                fullWidth
                @click="$router.push('/rifas')"
              >
                Ir a Cargar Rifas
              </Button>
            </div>
          </Card>

          <!-- Cargar Premios -->
          <Card variant="elevated" padding="lg" hover>
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Cargar Premios</h3>
              <p class="text-gray-600 mb-6">
                Define los premios disponibles con valores y orden de sorteo
              </p>
              <Button 
                variant="success" 
                size="lg"
                fullWidth
                @click="$router.push('/premios')"
              >
                Ir a Cargar Premios
              </Button>
            </div>
          </Card>

          <!-- Iniciar Sorteo -->
          <Card variant="elevated" padding="lg" hover>
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Iniciar Sorteo</h3>
              <p class="text-gray-600 mb-6">
                Comienza el sorteo para que todos puedan verlo
              </p>
              <Button 
                variant="warning" 
                size="lg"
                fullWidth
                :disabled="!puedeIniciarSorteo"
                @click="$router.push('/sorteo')"
              >
                Ir al Sorteo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Información Adicional -->
    <div class="info-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Próximo Premio -->
          <Card variant="outlined" padding="lg">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Próximo Premio a Sortear</h3>
            </template>
            
            <div v-if="proximoPremio" class="text-center">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-4">
                <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ proximoPremio.nombre }}</h4>
                <p class="text-gray-600 mb-3">{{ proximoPremio.descripcion }}</p>
                
              </div>
              <p class="text-sm text-gray-500">
                Orden de sorteo: {{ proximoPremio.orden }}
              </p>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <p class="text-gray-500">No hay premios disponibles</p>
            </div>
          </Card>

          <!-- Últimos Resultados -->
          <Card variant="outlined" padding="lg">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Últimos Resultados</h3>
            </template>

            <!-- Tabla de PDFs de sorteos históricos -->
            <div v-if="loadingSorteosDB" class="text-center py-4 text-gray-500">Cargando sorteos...</div>
            <div v-else-if="errorSorteosDB" class="text-center py-4 text-red-500">{{ errorSorteosDB }}</div>
            <div v-else-if="sorteosDB.length > 0">
              <table class="w-full mb-6 text-sm border border-gray-200" style="color: #000;">
                <thead>
                  <tr class="bg-gray-100" style="color: #000;">
                    <th class="py-2 px-4 border-b" style="color: #000;">Fecha</th>
                    <th class="py-2 px-4 border-b" style="color: #000;">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sorteo in sorteosDB.slice(0, 5)" :key="sorteo.id" style="color: #000;">
                    <td class="py-2 px-4 border-b" style="color: #000;">{{ formatDate(sorteo.fecha_sorteo) }}</td>
                    <td class="py-2 px-4 border-b" style="color: #000;">
                      <a :href="sorteo.pdf" target="_blank" class="text-blue-600 hover:underline font-semibold">Descargar PDF</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Mostrar el mensaje solo si NO hay PDFs ni resultados locales -->
            <div v-else-if="ultimosResultados.length === 0 && sorteosDB.length === 0" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-gray-500">No hay resultados aún</p>
            </div>

            <!-- Resultados locales -->
            <div v-if="ultimosResultados.length > 0" class="space-y-4">
              <div 
                v-for="resultado in ultimosResultados.slice(0, 3)" 
                :key="resultado.id"
                class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">{{ resultado.rifaGanadora.numero }}</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ resultado.premio.nombre }}</h4>
                  <p class="text-sm text-gray-600">{{ resultado.rifaGanadora.comprador }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-green-600">${{ resultado.premio.valor?.toLocaleString() }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(resultado.fechaSorteo) }}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Acciones Secundarias -->
    <div class="secondary-actions">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-wrap justify-center gap-4">
          <Button 
            variant="outline" 
            @click="reiniciarSorteo"
          >
            <template #icon-left>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </template>
            Reiniciar Sorteo
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../supabase'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSorteo } from '../composables/useSorteo'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'

const router = useRouter()

const {
  rifasDisponibles,
  premiosDisponibles,
  proximoPremio,
  estadoSorteo,
  sorteoCompleto,
  progresoSorteo,
  historialSorteos,
  obtenerEstadisticas,
  // exportarResultados, // Quitamos el viejo
  reiniciarSorteo,
  generarReporte
} = useSorteo()

// Estado local
const mostrarReporte = ref(false)

// Computed
const estadisticas = computed(() => obtenerEstadisticas())

const puedeIniciarSorteo = computed(() => {
  return rifasDisponibles.value.length > 0 && 
         premiosDisponibles.value.length > 0 &&
         estadoSorteo.value === 'inactivo'
})

const ultimosResultados = computed(() => {
  return Array.isArray(historialSorteos.value) ? historialSorteos.value.slice(-3).reverse() : []
})

const reporteCompleto = computed(() => {
  return generarReporte()
})

const sorteosDB = ref([])
const loadingSorteosDB = ref(false)
const errorSorteosDB = ref('')

onMounted(async () => {
  loadingSorteosDB.value = true
  errorSorteosDB.value = ''
  try {
    const { data, error } = await supabase.from('sorteos').select('*').order('fecha_sorteo', { ascending: false })
    if (error) throw error
    sorteosDB.value = data || []
  } catch (err) {
    errorSorteosDB.value = err.message || 'Error al cargar sorteos históricos.'
  } finally {
    loadingSorteosDB.value = false
  }
})

// Métodos
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

const copiarReporte = async () => {
  try {
    await navigator.clipboard.writeText(reporteCompleto.value)
    // Aquí podrías mostrar una notificación de éxito
  } catch (error) {
    console.error('Error al copiar reporte:', error)
  }
}

// Exportar resultados como PDF (HTML imprimible)
const exportarResultados = () => {
  const historial = historialSorteos.value
  let html = `
    <html>
    <head>
      <title>Resultados del Sorteo</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; }
        table { border-collapse: collapse; width: 100%; margin-top: 24px; }
        th, td { border: 1px solid #888; padding: 8px 12px; text-align: center; }
        th { background: #f3f3f3; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>Resultados del Sorteo</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Número Ganador</th>
            <th>Nombre Ganador</th>
            <th>Vendedor</th>
            <th>Premio</th>
          </tr>
        </thead>
        <tbody>
          ${historial.map((sorteo, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${sorteo.rifaGanadora?.numero ?? ''}</td>
              <td>${sorteo.rifaGanadora?.comprador ?? ''}</td>
              <td>${sorteo.rifaGanadora?.vendedor ?? ''}</td>
              <td>${sorteo.premio?.nombre ?? ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="margin-top:32px; text-align:right; color:#888; font-size:12px;">Generado: ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `
  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print() }, 500)
}

// Lifecycle
onMounted(() => {
  // Inicializar datos si es necesario
})
</script>

<style scoped>
.home-container {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-blue-50;
}

.header-section {
  background-color: #c6c8ca; /* Cambia este valor por el color que quieras probar */
  border-bottom: 2px solid #fbfdff; /* Cambia si querés el borde de otro color */
}

.actions-section {
  @apply py-12;
}

.info-section {
  @apply py-12;
}

.secondary-actions {
  @apply bg-white border-t border-gray-200;
}
</style>
  