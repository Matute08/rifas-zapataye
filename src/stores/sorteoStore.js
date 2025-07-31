import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRifaStore } from './rifaStore'
import { usePremioStore } from './premioStore'

export const useSorteoStore = defineStore('sorteo', () => {
  // Stores
  const rifaStore = useRifaStore()
  const premioStore = usePremioStore()

  // Estado
  const estadoSorteo = ref('inactivo') // 'inactivo', 'preparando', 'sorteando', 'mostrando_ganador', 'finalizado'
  const premioActual = ref(null)
  const rifaGanadora = ref(null)
  const historialSorteos = ref([])
  const configuracion = ref({
    duracionAnimacion: 8000, // Aumentado de 3000 a 6000ms (6 segundos)
    duracionMostrarGanador: 5000,
    sonidos: true,
    efectos: true,
    modoAutomatico: false
  })
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const puedeIniciarSorteo = computed(() => {
    return rifaStore.rifasDisponibles.length > 0 && 
           premioStore.premiosDisponibles.length > 0 &&
           estadoSorteo.value === 'inactivo'
  })

  const puedeContinuarSorteo = computed(() => {
    return premioStore.premiosDisponibles.length > 0 &&
           estadoSorteo.value === 'mostrando_ganador'
  })

  const totalSorteos = computed(() => historialSorteos.value.length)
  
  const progresoSorteo = computed(() => {
    const total = premioStore.totalPremios
    const completados = premioStore.premiosSorteadosCount
    return total > 0 ? (completados / total) * 100 : 0
  })

  const proximoPremio = computed(() => {
    return premioStore.premiosDisponibles[0] || null
  })

  const estadisticasSorteo = computed(() => {
    const stats = {
      totalRifas: rifaStore.totalRifas,
      rifasGanadas: rifaStore.rifasGanadas,
      rifasPendientes: rifaStore.rifasPendientes,
      totalPremios: premioStore.totalPremios,
      premiosSorteados: premioStore.premiosSorteadosCount,
      premiosPendientes: premioStore.premiosPendientes,
      porcentajeCompletado: progresoSorteo.value
    }
    return stats
  })

  // Actions
  const iniciarSorteo = async () => {
    try {
      if (!puedeIniciarSorteo.value) {
        throw new Error('No se puede iniciar el sorteo. Verifica que haya rifas y premios disponibles.')
      }

      loading.value = true
      estadoSorteo.value = 'preparando'
      
      // Obtener el próximo premio
      premioActual.value = proximoPremio.value
      
      if (!premioActual.value) {
        throw new Error('No hay premios disponibles para sortear')
      }

      estadoSorteo.value = 'sorteando'
      return { success: true, premio: premioActual.value }
    } catch (err) {
      error.value = err.message
      estadoSorteo.value = 'inactivo'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const realizarSorteo = async (numeroGanadorAnimado) => {
    try {
      if (estadoSorteo.value !== 'sorteando') {
        throw new Error('El sorteo no está en estado correcto')
      }

      const rifasDisponibles = rifaStore.rifasDisponibles
      if (rifasDisponibles.length === 0) {
        throw new Error('No hay rifas disponibles para sortear')
      }

      // Simular animación de sorteo (reducido para mostrar datos más rápido)
      await new Promise(resolve => setTimeout(resolve, 500)) // Reducido a 500ms para que sea más rápido

      // Seleccionar la rifa ganadora según el número animado
      let rifaGanadoraSeleccionada = rifasDisponibles.find(r => r.numero === numeroGanadorAnimado)
      // Si por algún motivo no se encuentra, elegir aleatoriamente (fallback)
      if (!rifaGanadoraSeleccionada) {
        const rifaGanadoraIndex = Math.floor(Math.random() * rifasDisponibles.length)
        rifaGanadoraSeleccionada = rifasDisponibles[rifaGanadoraIndex]
        console.warn('Número ganador no encontrado en rifas disponibles, usando selección aleatoria como fallback')
      }
      rifaGanadora.value = rifaGanadoraSeleccionada

      // Marcar como ganadora
      rifaStore.marcarComoGanadora(rifaGanadora.value.numero, premioActual.value.id)
      premioStore.marcarComoSorteado(premioActual.value.id, rifaGanadora.value)

      // Agregar al historial
      const sorteo = {
        id: Date.now().toString(),
        premio: premioActual.value,
        rifaGanadora: rifaGanadora.value,
        fechaSorteo: new Date().toISOString(),
        duracionAnimacion: configuracion.value.duracionAnimacion
      }
      historialSorteos.value.push(sorteo)

      estadoSorteo.value = 'mostrando_ganador'

      return { success: true, ganador: rifaGanadora.value }
    } catch (err) {
      error.value = err.message
      estadoSorteo.value = 'inactivo'
      return { success: false, error: err.message }
    }
  }

  const finalizarSorteoActual = () => {
    if (premioStore.premiosDisponibles.length === 0) {
      estadoSorteo.value = 'finalizado'
    } else {
      estadoSorteo.value = 'inactivo'
      premioActual.value = null
      rifaGanadora.value = null
    }
  }

  const continuarSorteo = async () => {
    if (puedeContinuarSorteo.value) {
      return await iniciarSorteo()
    }
    return { success: false, error: 'No se puede continuar el sorteo' }
  }

  const pausarSorteo = () => {
    if (estadoSorteo.value === 'sorteando') {
      estadoSorteo.value = 'pausado'
    }
  }

  const reanudarSorteo = () => {
    if (estadoSorteo.value === 'pausado') {
      estadoSorteo.value = 'sorteando'
    }
  }

  const cancelarSorteo = () => {
    estadoSorteo.value = 'inactivo'
    premioActual.value = null
    rifaGanadora.value = null
  }

  const reiniciarSorteo = () => {
    rifaStore.resetearGanadoras()
    premioStore.resetearSorteos()
    historialSorteos.value = []
    estadoSorteo.value = 'inactivo'
    premioActual.value = null
    rifaGanadora.value = null
  }

  const actualizarConfiguracion = (nuevaConfig) => {
    configuracion.value = { ...configuracion.value, ...nuevaConfig }
    guardarEnLocalStorage()
  }

  const obtenerSorteoPorId = (id) => {
    return historialSorteos.value.find(s => s.id === id)
  }

  const obtenerSorteosPorFecha = (fecha) => {
    const fechaInicio = new Date(fecha)
    fechaInicio.setHours(0, 0, 0, 0)
    const fechaFin = new Date(fecha)
    fechaFin.setHours(23, 59, 59, 999)
    
    return historialSorteos.value.filter(sorteo => {
      const fechaSorteo = new Date(sorteo.fechaSorteo)
      return fechaSorteo >= fechaInicio && fechaSorteo <= fechaFin
    })
  }

  const exportarHistorial = () => {
    const datos = {
      historial: historialSorteos.value,
      configuracion: configuracion.value,
      fechaExportacion: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial-sorteo-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Persistencia
  const guardarEnLocalStorage = () => {
    try {
      localStorage.setItem('sorteoConfiguracion', JSON.stringify(configuracion.value))
      localStorage.setItem('sorteoHistorial', JSON.stringify(historialSorteos.value))
    } catch (err) {
      console.error('Error al guardar en localStorage:', err)
    }
  }

  const cargarDesdeLocalStorage = () => {
    try {
      const configGuardada = localStorage.getItem('sorteoConfiguracion')
      const historialGuardado = localStorage.getItem('sorteoHistorial')
      
      if (configGuardada) {
        configuracion.value = JSON.parse(configGuardada)
      }
      
      if (historialGuardado) {
        historialSorteos.value = JSON.parse(historialGuardado)
      }
    } catch (err) {
      console.error('Error al cargar desde localStorage:', err)
    }
  }

  // Inicializar
  cargarDesdeLocalStorage()

  return {
    // Estado
    estadoSorteo,
    premioActual,
    rifaGanadora,
    historialSorteos,
    configuracion,
    loading,
    error,
    
    // Getters
    puedeIniciarSorteo,
    puedeContinuarSorteo,
    totalSorteos,
    progresoSorteo,
    proximoPremio,
    estadisticasSorteo,
    
    // Actions
    iniciarSorteo,
    realizarSorteo,
    finalizarSorteoActual,
    continuarSorteo,
    pausarSorteo,
    reanudarSorteo,
    cancelarSorteo,
    reiniciarSorteo,
    actualizarConfiguracion,
    obtenerSorteoPorId,
    obtenerSorteosPorFecha,
    exportarHistorial
  }
}) 