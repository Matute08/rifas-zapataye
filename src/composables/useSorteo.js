import { ref, computed } from 'vue'
import { useRifaStore } from '../stores/rifaStore'
import { usePremioStore } from '../stores/premioStore'
import { useSorteoStore } from '../stores/sorteoStore'

export function useSorteo() {
  const rifaStore = useRifaStore()
  const premioStore = usePremioStore()
  const sorteoStore = useSorteoStore()

  // Estado local
  const numerosMostrados = ref([])
  const numeroActual = ref(null)
  const velocidadSorteo = ref(100) // ms entre números
  const estaSorteando = ref(false)

  // Getters
  const rifasDisponibles = computed(() => rifaStore.rifasDisponibles)
  const premiosDisponibles = computed(() => premioStore.premiosDisponibles)
  const proximoPremio = computed(() => sorteoStore.proximoPremio)
  const estadoSorteo = computed(() => sorteoStore.estadoSorteo)

  // Algoritmo Fisher-Yates para mezclar array
  const mezclarArray = (array) => {
    const mezclado = [...array]
    for (let i = mezclado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]]
    }
    return mezclado
  }

  // Generar secuencia de números para mostrar
  const generarSecuencia = (cantidad = 20) => {
    const numeros = []
    const rifasDisponibles = rifaStore.rifasDisponibles
    
    if (rifasDisponibles.length === 0) return numeros

    // Mezclar las rifas disponibles
    const rifasMezcladas = mezclarArray(rifasDisponibles)
    
    // Tomar los primeros números para la secuencia
    for (let i = 0; i < Math.min(cantidad, rifasMezcladas.length); i++) {
      numeros.push(rifasMezcladas[i].numero)
    }
    
    return numeros
  }

  // Iniciar sorteo
  const iniciarSorteo = async () => {
    try {
      // Limpiar bolas antes de iniciar
      numerosMostrados.value = []
      numeroActual.value = null
      if (!sorteoStore.puedeIniciarSorteo) {
        throw new Error('No se puede iniciar el sorteo')
      }

      const resultado = await sorteoStore.iniciarSorteo()
      if (resultado.success) {
        return resultado
      } else {
        throw new Error(resultado.error)
      }
    } catch (error) {
      console.error('Error al iniciar sorteo:', error)
      throw error
    }
  }

  // Realizar sorteo con animación
  const realizarSorteoConAnimacion = async (duracion = 3000) => {
    try {
      estaSorteando.value = true
      numerosMostrados.value = []
      
      // Generar secuencia de números para mostrar
      const secuencia = generarSecuencia(30)
      const numeroGanador = secuencia[secuencia.length - 1]
      
      // Mostrar números rápidamente
      for (let i = 0; i < secuencia.length - 1; i++) {
        numeroActual.value = secuencia[i]
        numerosMostrados.value.push(secuencia[i])
        
        // Aumentar velocidad gradualmente
        const delay = Math.max(50, velocidadSorteo.value - (i * 2))
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      // Mostrar número ganador
      numeroActual.value = numeroGanador
      numerosMostrados.value.push(numeroGanador)
      
      // Realizar el sorteo real, pasando el número ganador
      const resultado = await sorteoStore.realizarSorteo(numeroGanador)
      
      if (resultado.success) {
        return resultado
      } else {
        throw new Error(resultado.error)
      }
    } catch (error) {
      console.error('Error en sorteo con animación:', error)
      throw error
    } finally {
      estaSorteando.value = false
    }
  }

  // Continuar al siguiente premio
  const continuarSorteo = async () => {
    try {
      // Limpiar bolas antes de continuar
      numerosMostrados.value = []
      numeroActual.value = null
      if (!sorteoStore.puedeContinuarSorteo) {
        throw new Error('No se puede continuar el sorteo')
      }

      const resultado = await sorteoStore.continuarSorteo()
      if (resultado.success) {
        return resultado
      } else {
        throw new Error(resultado.error)
      }
    } catch (error) {
      console.error('Error al continuar sorteo:', error)
      throw error
    }
  }

  // Finalizar sorteo actual
  const finalizarSorteoActual = () => {
    sorteoStore.finalizarSorteoActual()
  }

  // Cancelar sorteo
  const cancelarSorteo = () => {
    sorteoStore.cancelarSorteo()
    estaSorteando.value = false
    numerosMostrados.value = []
    numeroActual.value = null
  }

  // Reiniciar todo el sorteo
  const reiniciarSorteo = () => {
    sorteoStore.reiniciarSorteo()
    estaSorteando.value = false
    numerosMostrados.value = []
    numeroActual.value = null
  }

  // Obtener estadísticas del sorteo
  const obtenerEstadisticas = () => {
    return sorteoStore.estadisticasSorteo
  }

  // Verificar si el sorteo está completo
  const sorteoCompleto = computed(() => {
    return premioStore.premiosDisponibles.length === 0
  })

  // Obtener progreso del sorteo
  const progresoSorteo = computed(() => {
    return sorteoStore.progresoSorteo
  })

  // Obtener historial de sorteos
  const historialSorteos = computed(() => sorteoStore.historialSorteos.value)

  // Exportar resultados
  const exportarResultados = () => {
    const datos = {
      rifas: rifaStore.rifas,
      rifasGanadoras: rifaStore.rifasGanadoras,
      premios: premioStore.premios,
      premiosSorteados: premioStore.premiosSorteados,
      historialSorteos: sorteoStore.historialSorteos,
      estadisticas: sorteoStore.estadisticasSorteo,
      fechaExportacion: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resultados-sorteo-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Generar reporte en texto
  const generarReporte = () => {
    const stats = sorteoStore.estadisticasSorteo
    const historial = sorteoStore.historialSorteos
    
    let reporte = `REPORTE DE SORTEO\n`
    reporte += `Fecha: ${new Date().toLocaleDateString()}\n`
    reporte += `Hora: ${new Date().toLocaleTimeString()}\n\n`
    
    reporte += `ESTADÍSTICAS GENERALES:\n`
    reporte += `- Total de rifas: ${stats.totalRifas}\n`
    reporte += `- Rifas ganadas: ${stats.rifasGanadas}\n`
    reporte += `- Rifas pendientes: ${stats.rifasPendientes}\n`
    reporte += `- Total de premios: ${stats.totalPremios}\n`
    reporte += `- Premios sorteados: ${stats.premiosSorteados}\n`
    reporte += `- Premios pendientes: ${stats.premiosPendientes}\n`
    reporte += `- Progreso: ${stats.porcentajeCompletado.toFixed(1)}%\n\n`
    
    reporte += `RESULTADOS DEL SORTEO:\n`
    historial.forEach((sorteo, index) => {
      reporte += `${index + 1}. Premio: ${sorteo.premio.nombre}\n`
      reporte += `   Ganador: ${sorteo.rifaGanadora.comprador}\n`
      reporte += `   Número: ${sorteo.rifaGanadora.numero}\n`
      reporte += `   Vendedor: ${sorteo.rifaGanadora.vendedor}\n`
      reporte += `   Fecha: ${new Date(sorteo.fechaSorteo).toLocaleString()}\n\n`
    })
    
    return reporte
  }

  return {
    // Estado
    numerosMostrados,
    numeroActual,
    velocidadSorteo,
    estaSorteando,
    
    // Getters
    rifasDisponibles,
    premiosDisponibles,
    proximoPremio,
    estadoSorteo,
    sorteoCompleto,
    progresoSorteo,
    historialSorteos,
    
    // Actions
    iniciarSorteo,
    realizarSorteoConAnimacion,
    continuarSorteo,
    finalizarSorteoActual,
    cancelarSorteo,
    reiniciarSorteo,
    obtenerEstadisticas,
    exportarResultados,
    generarReporte,
    mezclarArray,
    generarSecuencia
  }
} 