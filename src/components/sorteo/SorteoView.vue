<template>
  <div class="sorteo-container">
    <!-- Botón Volver al Inicio -->
    <div class="flex justify-end mb-4">
      
    </div>
    <!-- Header del Sorteo -->
    <div class="sorteo-header">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Sorteo de Rifas</h1>
          <p class="text-gray-800 mt-1">Sistema de sorteo de Zapataye Fútbol Club</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm text-gray-800">Progreso</p>
            <p class="text-lg font-semibold text-blue-600">{{ progresoSorteo.toFixed(1) }}%</p>
          </div>
          <div class="w-32 bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${progresoSorteo}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card variant="elevated" padding="sm" :class="'bg-gradient-to-br from-blue-600 to-blue-800 text-white'">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ estadisticas.totalRifas }}</p>
            <p class="text-sm">Total Rifas</p>
          </div>
        </Card>
        <Card variant="elevated" padding="sm" :class="'bg-gradient-to-br from-blue-600 to-blue-800 text-white'">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ estadisticas.rifasPendientes }}</p>
            <p class="text-sm">Rifas Pendientes</p>
          </div>
        </Card>
        <Card variant="elevated" padding="sm" :class="'bg-gradient-to-br from-purple-600 to-purple-800 text-white'">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ estadisticas.totalPremios }}</p>
            <p class="text-sm">Total Premios</p>
          </div>
        </Card>
        <Card variant="elevated" padding="sm" :class="'bg-gradient-to-br from-purple-600 to-purple-800 text-white'">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ estadisticas.premiosPendientes }}</p>
            <p class="text-sm">Premios Pendientes</p>
          </div>
        </Card>
      </div>
    </div>

    <!-- Área Principal del Sorteo -->
    <div class="sorteo-main">
      <!-- Estado: Inactivo -->
      <div v-if="estadoSorteo === 'inactivo'" class="text-center py-12">
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Listo para el Sorteo</h2>
          <p class="text-gray-900 mb-6">Haz clic en "Iniciar Sorteo" para comenzar</p>
          
          <div v-if="proximoPremio" class="mb-6">
            <p class="text-sm text-gray-900 mb-2">Próximo premio a sortear:</p>
            <div class="bg-white rounded-lg p-4 shadow-md">
              <div class="flex items-center">
                <!-- Imagen del Próximo Premio -->
                <div class="flex-shrink-0 mr-4">
                  <div class="w-24 h-24 rounded-lg overflow-hidden shadow-md premio-imagen bg-gradient-to-br from-gray-200 to-gray-300">
                    <img 
                      v-if="proximoPremio.imagen" 
                      :src="proximoPremio.imagen" 
                      :alt="proximoPremio.nombre"
                      class="w-full h-full object-contain transition-opacity duration-300"
                      @error="handleImageError"
                      @load="handleImageLoad"
                    />
                    <div v-if="!proximoPremio.imagen || imagenError" class="w-full h-full flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Información del Próximo Premio -->
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-gray-900">{{ proximoPremio.nombre }}</h3>
                  <p class="text-gray-900">{{ proximoPremio.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="lg"
            @click="reiniciarSorteo"
          >
            Reiniciar Todo
          </Button>
                     <Button 
             variant="primary" 
             size="lg"
             :disabled="!puedeIniciarSorteo"
             @click="handleIniciarSorteo"
           >
            <template #icon-left>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </template>
            Iniciar Sorteo
          </Button>
        </div>
      </div>

      <!-- Estado: Preparando -->
      <div v-else-if="estadoSorteo === 'preparando'" class="text-center py-12">
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
            <svg class="w-16 h-16 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Preparando Sorteo</h2>
          <p class="text-gray-600">Preparando el próximo premio...</p>
        </div>
      </div>

      <!-- Estado: Sorteando -->
      <div v-else-if="estadoSorteo === 'sorteando'" class="sorteo-activo">
        <!-- Premio Actual -->
        <div class="premio-actual mb-8">
          <Card variant="elevated" padding="lg">
            <div class="flex items-center justify-center">
              <!-- Imagen del Premio -->
              <div class="flex-shrink-0 mr-8">
                <div class="w-60 h-60 rounded-xl overflow-hidden shadow-lg premio-imagen bg-gradient-to-br from-gray-200 to-gray-300">
                  <img 
                    v-if="(premioActual?.imagen || proximoPremio?.imagen) && !imagenError" 
                    :src="premioActual?.imagen || proximoPremio?.imagen" 
                    :alt="premioActual?.nombre || proximoPremio?.nombre"
                    class="w-full h-full object-contain transition-opacity duration-300"
                    @error="handleImageError"
                    @load="handleImageLoad"
                  />
                  <div v-if="!premioActual?.imagen && !proximoPremio?.imagen || imagenError" class="w-full h-full flex items-center justify-center">
                    <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Información del Premio -->
              <div class="text-center flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Sorteando Premio</h2>
                <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ premioActual?.nombre || proximoPremio?.nombre || 'Premio a sortear' }}</h3>
                  <p class="text-gray-900 mb-3">{{ premioActual?.descripcion || proximoPremio?.descripcion }}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Área de Animación -->
        <div class="animacion-area mb-8">
          <div class="relative">
            <!-- Ruleta de Números -->
            <div class="ruleta-container">
              <div class="ruleta-numeros" v-if="numerosMostrados.length > 0">
                <div 
                  v-for="numero in numerosMostrados.slice(-10)" 
                  :key="numero"
                  class="numero-bola"
                  :class="{ 'numero-actual': numero === numeroActual }"
                >
                  {{ numero }}
                </div>
              </div>
            </div>

            <!-- Número Actual -->
            <div v-if="numeroActual" class="numero-ganador">
              <div class="bola-ganadora">
                <span class="numero-texto">{{ numeroActual }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles -->
        <div class="controles-sorteo">
          <div class="flex justify-center space-x-4">
            <Button 
              variant="danger" 
              @click="cancelarSorteo"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      <!-- Estado: Mostrando Ganador -->
      <div v-else-if="estadoSorteo === 'mostrando_ganador'" class="ganador-area">
        <div class="text-center py-12">
          <!-- Animación de Celebración -->
          <div class="celebracion-container mb-8">
            <div class="confeti-container" ref="confetiContainer"></div>
            
            <!-- Premio Ganado -->
            <div class="premio-ganado mb-8">
              <Card variant="elevated" padding="lg">
                <div class="flex items-center justify-center">
                  <!-- Imagen del Premio Ganado -->
                  <div class="flex-shrink-0 mr-8">
                    <div class="w-48 h-48 rounded-xl overflow-hidden shadow-lg premio-imagen bg-gradient-to-br from-green-500 to-emerald-600">
                      <img 
                        v-if="sorteoStore.premioActual?.imagen && !imagenError" 
                        :src="sorteoStore.premioActual.imagen" 
                        :alt="sorteoStore.premioActual.nombre"
                        class="w-full h-full object-contain transition-opacity duration-300"
                        @error="handleImageError"
                        @load="handleImageLoad"
                      />
                      <div v-if="!sorteoStore.premioActual?.imagen || imagenError" class="w-full h-full flex items-center justify-center">
                        <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Información del Premio Ganado -->
                  <div class="text-center flex-1">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">¡Premio Ganado!</h2>
                    <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 mb-6">
                      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ sorteoStore.premioActual?.nombre || 'Premio a sortear' }}</h3>
                      <p class="text-gray-900 mb-3">{{ sorteoStore.premioActual?.descripcion }}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Información del Ganador -->
            <div class="ganador-info mb-8">
              <Card variant="gradient" padding="lg">
                <div class="text-center">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">¡Felicidades!</h3>
                  <div class="bg-white bg-opacity-20 rounded-lg p-6">
                    <div class="text-4xl font-bold text-gray-900 mb-2">{{ sorteoStore.rifaGanadora?.numero }}</div>
                    <p class="text-gray-900 text-lg mb-2">{{ sorteoStore.rifaGanadora?.comprador }}</p>
                    <p class="text-gray-900">Vendido por: {{ sorteoStore.rifaGanadora?.vendedor }}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-center space-x-4">
            <Button 
              v-if="premiosDisponibles.length === 0"
              variant="outline" 
              size="lg"
              @click="finalizarSorteoActual"
            >
              Finalizar
            </Button>
            <Button 
              v-else
              variant="primary" 
              size="lg"
              @click="handleContinuarSorteo"
            >
              Siguiente Premio
            </Button>
          </div>
        </div>
      </div>

      <!-- Estado: Finalizado -->
      <div v-else-if="estadoSorteo === 'finalizado'" class="text-center py-12">
        <div class="mb-8">
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">¡Sorteo Completado!</h2>
          <h3 class="text-gray-600 mb-6">Gracias por participar y ayudar a Zapataye. #25AñosDeHistoria</h3  >
        </div>

        <div class="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            @click="exportarResultados"
          >
            Exportar Resultados
          </Button>
          <Button variant="outline" @click="volverInicio">
        <template #icon-left>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </template>
        Volver al inicio
      </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSorteo } from '../../composables/useSorteo'
import { useSorteoStore } from '../../stores/sorteoStore'
import { useAnimations } from '../../composables/useAnimations'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import html2pdf from 'html2pdf.js'
import { supabase } from '../../supabase'
import Swal from 'sweetalert2'

const router = useRouter()
const volverInicio = () => {
  router.push('/')
}

const sorteoStore = useSorteoStore()

const {
  rifasDisponibles,
  premiosDisponibles,
  proximoPremio,
  estadoSorteo,
  sorteoCompleto,
  progresoSorteo,
  historialSorteos,
  iniciarSorteo,
  realizarSorteoConAnimacion,
  continuarSorteo,
  finalizarSorteoActual,
  cancelarSorteo,
  reiniciarSorteo,
  obtenerEstadisticas,
  // exportarResultados, // Quitamos el viejo
  numerosMostrados,
  numeroActual,
  estaSorteando
} = useSorteo()

// Obtener el premio actual del store
const premioActual = computed(() => sorteoStore.premioActual)

const { confetti, celebracion, stopAll } = useAnimations()

// Estado local
const confetiContainer = ref(null)
const imagenError = ref(false)

// Computed
const estadisticas = computed(() => obtenerEstadisticas())

const puedeIniciarSorteo = computed(() => {
  return rifasDisponibles.value.length > 0 && 
         premiosDisponibles.value.length > 0 &&
         estadoSorteo.value === 'inactivo'
})

const puedeContinuarSorteo = computed(() => {
  return premiosDisponibles.value.length > 0 &&
         estadoSorteo.value === 'mostrando_ganador'
})

// Exportar resultados como PDF (HTML imprimible)
const exportarResultados = () => {
  const historial = sorteoStore.historialSorteos
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

// Nuevo: Generar y guardar PDF al finalizar el sorteo
defineExpose({ generarYGuardarPDF })

async function generarYGuardarPDF() {
  try {
    await nextTick() // Forzar render actualizado
    // Validar que el historial tenga datos
    if (!sorteoStore.historialSorteos || sorteoStore.historialSorteos.length === 0) {
      Swal.fire('Sin datos', 'No hay información de ganadores para el PDF. El historial está vacío.', 'info')
      console.warn('Historial de sorteos vacío al generar PDF:', sorteoStore.historialSorteos)
      return
    }
    // Generar HTML del reporte dinámicamente
    const historial = sorteoStore.historialSorteos
    const html = `
      <html>
      <head>
        <title>Resultados del Sorteo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #000; }
          h1 { text-align: center; color: #000; }
          table { border-collapse: collapse; width: 100%; margin-top: 24px; color: #000; }
          th, td { border: 1px solid #888; padding: 8px 12px; text-align: center; color: #000; background: #fff; }
          th { background: #f3f3f3; color: #000; }
          tr:nth-child(even) { background: #f9f9f9; color: #000; }
          p { color: #000; }
        </style>
      </head>
      <body>
        <h1>Resultados del Sorteo</h1>
        <p style="font-size:14px;">Fecha: ${new Date().toLocaleString()}</p>
        <p style="font-size:14px;">Total premios sorteados: ${historial.length}</p>
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
        <p style="margin-top:32px;text-align:right;font-size:12px;">Generado: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `
    // Generar PDF desde HTML string
    const opt = {
      margin: 0.5,
      filename: `sorteo-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    }
    // Crear un elemento temporal para html2pdf
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    document.body.appendChild(tempDiv)
    const worker = html2pdf().set(opt).from(tempDiv)
    const pdfString = await worker.outputPdf()
    document.body.removeChild(tempDiv)
    // Convertir a Uint8Array
    const uint8Array = new Uint8Array(pdfString.length)
    for (let i = 0; i < pdfString.length; i++) {
      uint8Array[i] = pdfString.charCodeAt(i)
    }
    const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' })
    // Subir a Supabase Storage
    const fileName = `sorteo-${Date.now()}.pdf`
    const { data, error: uploadError } = await supabase.storage.from('sorteos').upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    })
    if (uploadError) {
      Swal.fire('Error', 'Error al subir el PDF a Supabase: ' + uploadError.message, 'error')
      console.error('Supabase upload error:', uploadError)
      return
    }
    // Obtener URL pública
    const { data: publicUrlData, error: urlError } = supabase.storage.from('sorteos').getPublicUrl(fileName)
    if (urlError) {
      Swal.fire('Error', 'Error al obtener la URL pública del PDF: ' + urlError.message, 'error')
      console.error('Supabase getPublicUrl error:', urlError)
      return
    }
    const pdfUrl = publicUrlData.publicUrl
    // Guardar en la tabla 'sorteos'
    const { error: insertError } = await supabase.from('sorteos').insert([
      {
        pdf: pdfUrl,
        fecha_sorteo: new Date().toISOString(),
      }
    ])
    if (insertError) {
      alert('Error al guardar el registro en la tabla sorteos: ' + insertError.message)
      console.error('Supabase insert error:', insertError)
      return
    }
    alert('¡PDF del sorteo guardado exitosamente en Supabase!')
    console.log('PDF guardado en:', pdfUrl)
  } catch (err) {
    alert('Error inesperado al generar/guardar el PDF. Ver consola.')
    console.error('Error al generar/guardar PDF:', err)
  }
}

// Llamar automáticamente al finalizar el sorteo
watch(
  () => estadoSorteo.value,
  async (nuevoEstado) => {
    if (nuevoEstado === 'finalizado') {
      await generarYGuardarPDF()
    }
  }
)

// Métodos
const handleImageError = (event) => {
  console.warn('Error al cargar imagen:', event.target.src)
  imagenError.value = true
}

const handleImageLoad = (event) => {
  imagenError.value = false
}

const handleIniciarSorteo = async () => {
  try {
    await iniciarSorteo()
    numerosMostrados.value = []
    numeroActual.value = null
    
    // Automáticamente ejecutar la animación después de iniciar
    setTimeout(async () => {
      try {
        const resultado = await realizarSorteoConAnimacion()
        if (resultado?.success && confetiContainer.value) {
          confetti(confetiContainer.value)
        }
      } catch (error) {
        console.error('Error en la animación:', error)
      }
    }, 500) // Pequeña pausa para que se vea el estado "preparando"
  } catch (error) {
    console.error('Error al iniciar sorteo:', error)
  }
}



const handleContinuarSorteo = async () => {
  await continuarSorteo()
}

// Lifecycle
onMounted(() => {})
onUnmounted(() => { stopAll() })
</script>

<style scoped>
.sorteo-container {
  @apply max-w-6xl mx-auto px-4 py-8;
}

.sorteo-header {
  @apply mb-8;
}

.sorteo-main {
  @apply min-h-96;
}

.sorteo-activo {
  @apply text-center;
}

.animacion-area {
  @apply relative;
}

.ruleta-container {
  @apply relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-8 mb-8;
  min-height: 200px;
}

.ruleta-numeros {
  @apply flex flex-wrap justify-center items-center gap-4;
}

.numero-bola {
  @apply w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-gray-800 shadow-lg transition-all duration-300;
}

.numero-actual {
  @apply bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-110 shadow-xl;
}

.numero-ganador {
  @apply absolute inset-0 flex items-center justify-center;
}

.bola-ganadora {
  @apply w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl;
  animation: bounce 1s infinite;
}

.numero-texto {
  @apply text-4xl font-bold text-white;
}

.controles-sorteo {
  @apply mt-8;
}

.ganador-area {
  @apply text-center;
}

.celebracion-container {
  @apply relative;
  position: relative;
  z-index: 1; /* Asegurar que el contenedor esté por encima del contenido normal */
}

.confeti-container {
  @apply absolute inset-0 pointer-events-none;
  z-index: 9999; /* Asegurar que esté por encima de todo */
  max-height: 100vh; /* Limitar la altura máxima al viewport */
  overflow: hidden; /* Evitar que el confeti se salga del contenedor */
}

.premio-ganado {
  @apply relative z-10;
}

.ganador-info {
  @apply relative z-10;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Estilos para las imágenes de premios */
.premio-imagen {
  @apply transition-all duration-300 hover:scale-105;
  position: relative;
}

.premio-imagen img {
  @apply transition-opacity duration-300;
  backface-visibility: hidden;
}

.premio-imagen img:hover {
  @apply opacity-90;
}

/* Mejorar la calidad de las imágenes */
.premio-imagen img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Responsive para las imágenes */
@media (max-width: 768px) {
  .premio-actual .flex {
    @apply flex-col;
  }
  
  .premio-actual .flex-shrink-0 {
    @apply mr-0 mb-4;
  }
  
  .premio-actual .w-48 {
    @apply w-32 h-32;
  }
  
  .premio-ganado .flex {
    @apply flex-col;
  }
  
  .premio-ganado .flex-shrink-0 {
    @apply mr-0 mb-4;
  }
  
  .premio-ganado .w-48 {
    @apply w-32 h-32;
  }
}
</style> 