import { ref, computed } from 'vue'
import { useRifaStore } from '../stores/rifaStore'
import { usePremioStore } from '../stores/premioStore'
import { useSorteoStore } from '../stores/sorteoStore'
import CryptoJS from 'crypto-js'

export function useSorteo() {
  const rifaStore = useRifaStore()
  const premioStore = usePremioStore()
  const sorteoStore = useSorteoStore()

  // Estado local
  const numerosMostrados = ref([])
  const numeroActual = ref(null)
  const velocidadSorteo = ref(150) // ms entre números (aumentado para más duración)
  const estaSorteando = ref(false)

  // Getters
  const rifasDisponibles = computed(() => rifaStore.rifasDisponibles)
  const premiosDisponibles = computed(() => premioStore.premiosDisponibles)
  const proximoPremio = computed(() => sorteoStore.proximoPremio)
  const estadoSorteo = computed(() => sorteoStore.estadoSorteo)

  // Generador de números aleatorios criptográficos
  const generarNumeroCriptografico = (min, max) => {
    const bytes = CryptoJS.lib.WordArray.random(4)
    const valor = bytes.words[0] >>> 0 // Convertir a entero positivo
    return min + (valor % (max - min + 1))
  }

  // Generador alternativo usando Math.random() + criptografía
  const generarNumeroAlternativo = (min, max) => {
    // Combinar Math.random() con criptografía para mayor entropía
    const cryptoBytes = CryptoJS.lib.WordArray.random(4)
    const cryptoValor = cryptoBytes.words[0] >>> 0
    const mathRandom = Math.random()
    
    // Combinar ambos valores
    const combined = (cryptoValor + mathRandom * 1000000) % (max - min + 1)
    return min + Math.floor(combined)
  }

  // Generador simple y confiable usando solo Math.random()
  const generarNumeroSimple = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Algoritmo Fisher-Yates mejorado con criptografía
  const mezclarArrayCriptografico = (array) => {
    const mezclado = [...array]
    for (let i = mezclado.length - 1; i > 0; i--) {
      const j = generarNumeroCriptografico(0, i)
      ;[mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]]
    }
    return mezclado
  }



  // Algoritmo con Fisher-Yates shuffle para distribución uniforme garantizada
  const seleccionarGanadorProfesional = () => {
    const rifasDisponibles = rifaStore.rifasDisponibles
    
    // Crear una copia mezclada del array para garantizar distribución uniforme
    const rifasMezcladas = mezclarArrayCriptografico([...rifasDisponibles])
    
    // Seleccionar el primer elemento de la mezcla (ya está aleatorizado)
    const rifaGanadora = rifasMezcladas[0]
    
    console.log(`🎲 Selección con Fisher-Yates: número ${rifaGanadora.numero} (de ${rifasDisponibles.length} disponibles)`)
    
    return rifaGanadora
  }

  // Función de diagnóstico para verificar la aleatoriedad
  const diagnosticarAleatoriedad = (cantidadPruebas = 10) => {
    console.log(`\n🔍 DIAGNÓSTICO DE ALEATORIEDAD`)
    console.log(`Rifas disponibles: ${rifaStore.rifasDisponibles.length}`)
    
    // Mostrar algunos números disponibles
    const numerosDisponibles = rifaStore.rifasDisponibles.map(r => r.numero).sort((a, b) => a - b)
    console.log(`Rango de números: ${Math.min(...numerosDisponibles)} - ${Math.max(...numerosDisponibles)}`)
    
    // Probar la función de generación de números
    console.log(`\n🧪 PRUEBA DE GENERACIÓN DE NÚMEROS:`)
    for (let i = 0; i < 5; i++) {
      const numero = generarNumeroCriptografico(0, rifaStore.rifasDisponibles.length - 1)
      console.log(`Generado ${i + 1}: ${numero}`)
    }
    
    // Probar selecciones
    console.log(`\n🎲 PRUEBA DE SELECCIONES:`)
    const selecciones = []
    for (let i = 0; i < cantidadPruebas; i++) {
      const rifa = seleccionarGanadorProfesional()
      selecciones.push(rifa.numero)
    }
    
    console.log(`Números seleccionados: ${selecciones.join(', ')}`)
    
    // Verificar distribución
    const rangos = {}
    selecciones.forEach(numero => {
      const rango = Math.ceil(numero / 100)
      const clave = `${(rango - 1) * 100 + 1}-${rango * 100}`
      rangos[clave] = (rangos[clave] || 0) + 1
    })
    
    console.log(`\n📊 DISTRIBUCIÓN POR RANGOS:`)
    Object.entries(rangos).forEach(([rango, cantidad]) => {
      console.log(`${rango}: ${cantidad} números`)
    })
    
         return { selecciones, rangos }
   }

   // Función para probar la distribución con Math.random() simple
   const probarDistribucionSimple = (cantidadPruebas = 24) => {
     console.log(`\n🎲 PRUEBA DE DISTRIBUCIÓN CON MATH.RANDOM()`)
     console.log(`Rifas disponibles: ${rifaStore.rifasDisponibles.length}`)
     
     const numerosGanadores = []
     const vendedoresGanadores = new Map()
     
     console.log(`\n🧪 EJECUTANDO ${cantidadPruebas} SORTEOS CON MATH.RANDOM()...`)
     
     for (let i = 0; i < cantidadPruebas; i++) {
       const rifasDisponibles = rifaStore.rifasDisponibles
       if (rifasDisponibles.length > 0) {
         // Usar Math.random() simple
         const indiceGanador = generarNumeroSimple(0, rifasDisponibles.length - 1)
         const rifaGanadora = rifasDisponibles[indiceGanador]
         
         numerosGanadores.push(rifaGanadora.numero)
         
         // Contar ganancias por vendedor
         const vendedor = rifaGanadora.vendedor
         vendedoresGanadores.set(vendedor, (vendedoresGanadores.get(vendedor) || 0) + 1)
         
         console.log(`Sorteo ${i + 1}: ${rifaGanadora.numero} (${vendedor})`)
       }
     }
     
     console.log(`\n📊 RESULTADOS: ${numerosGanadores.join(', ')}`)
     
     // Análisis de distribución
     const maxNumero = Math.max(...numerosGanadores)
     const mitad = maxNumero / 2
     const numerosBajos = numerosGanadores.filter(n => n <= mitad).length
     const numerosAltos = numerosGanadores.filter(n => n > mitad).length
     
     console.log(`\n📈 DISTRIBUCIÓN:`)
     console.log(`Números bajos (1-${Math.floor(mitad)}): ${numerosBajos} (${((numerosBajos/cantidadPruebas)*100).toFixed(1)}%)`)
     console.log(`Números altos (${Math.floor(mitad)+1}-${maxNumero}): ${numerosAltos} (${((numerosAltos/cantidadPruebas)*100).toFixed(1)}%)`)
     
     // Análisis de vendedores
     console.log(`\n👥 VENDEDORES ÚNICOS: ${vendedoresGanadores.size}`)
     
     // Mostrar vendedores con más ganancias
     const vendedoresOrdenados = Array.from(vendedoresGanadores.entries())
       .sort((a, b) => b[1] - a[1])
       .slice(0, 5)
     
     console.log(`\n🏆 TOP 5 VENDEDORES:`)
     vendedoresOrdenados.forEach(([vendedor, ganancias], index) => {
       console.log(`${index + 1}. ${vendedor}: ${ganancias} premios`)
     })
     
     return { numerosGanadores, vendedoresGanadores: Object.fromEntries(vendedoresGanadores) }
   }

   // Función para probar la distribución con Fisher-Yates shuffle
   const probarDistribucionFisherYates = (cantidadPruebas = 24) => {
     console.log(`\n🎲 PRUEBA DE DISTRIBUCIÓN CON FISHER-YATES`)
     console.log(`Rifas disponibles: ${rifaStore.rifasDisponibles.length}`)
     
     const numerosGanadores = []
     const vendedoresGanadores = new Map()
     
     console.log(`\n🧪 EJECUTANDO ${cantidadPruebas} SORTEOS CON FISHER-YATES...`)
     
     for (let i = 0; i < cantidadPruebas; i++) {
       const rifasDisponibles = rifaStore.rifasDisponibles
       if (rifasDisponibles.length > 0) {
         // Usar Fisher-Yates shuffle
         const rifasMezcladas = mezclarArrayCriptografico([...rifasDisponibles])
         const rifaGanadora = rifasMezcladas[0]
         
         numerosGanadores.push(rifaGanadora.numero)
         
         // Contar ganancias por vendedor
         const vendedor = rifaGanadora.vendedor
         vendedoresGanadores.set(vendedor, (vendedoresGanadores.get(vendedor) || 0) + 1)
         
         console.log(`Sorteo ${i + 1}: ${rifaGanadora.numero} (${vendedor})`)
       }
     }
     
     console.log(`\n📊 RESULTADOS: ${numerosGanadores.join(', ')}`)
     
     // Análisis detallado de distribución
     const numerosOrdenados = [...numerosGanadores].sort((a, b) => a - b)
     console.log(`\n📈 NÚMEROS ORDENADOS: ${numerosOrdenados.join(', ')}`)
     
     // Análisis por rangos de 100
     const rangos = {}
     numerosGanadores.forEach(numero => {
       const rango = Math.floor(numero / 100) * 100
       const clave = `${rango + 1}-${rango + 100}`
       rangos[clave] = (rangos[clave] || 0) + 1
     })
     
     console.log(`\n📊 DISTRIBUCIÓN POR RANGOS DE 100:`)
     Object.entries(rangos).forEach(([rango, cantidad]) => {
       console.log(`${rango}: ${cantidad} números (${((cantidad/cantidadPruebas)*100).toFixed(1)}%)`)
     })
     
     // Análisis de vendedores
     console.log(`\n👥 VENDEDORES ÚNICOS: ${vendedoresGanadores.size}`)
     
     // Mostrar vendedores con más ganancias
     const vendedoresOrdenados = Array.from(vendedoresGanadores.entries())
       .sort((a, b) => b[1] - a[1])
       .slice(0, 5)
     
     console.log(`\n🏆 TOP 5 VENDEDORES:`)
     vendedoresOrdenados.forEach(([vendedor, ganancias], index) => {
       console.log(`${index + 1}. ${vendedor}: ${ganancias} premios`)
     })
     
     return { numerosGanadores, vendedoresGanadores: Object.fromEntries(vendedoresGanadores) }
   }

  // Función para verificar distribución uniforme (solo para debugging)
  const verificarDistribucion = (numeros, totalRifas = 1000) => {
    const rangos = {
      '1-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-1000': 0
    }
    
    numeros.forEach(numero => {
      const rango = Math.ceil(numero / 100)
      const clave = `${(rango - 1) * 100 + 1}-${rango * 100}`
      if (rangos[clave] !== undefined) {
        rangos[clave]++
      }
    })
    
    console.log('Distribución de números:', rangos)
    return rangos
  }

  // Función para probar la distribución del sorteo - VERSIÓN SIMPLE
  const probarDistribucionSorteo = (cantidadPruebas = 100) => {
    console.log(`\n🎲 PRUEBA DE ALEATORIEDAD`)
    console.log(`Rifas disponibles: ${rifaStore.rifasDisponibles.length}`)
    console.log(`Probabilidad por rifa: 1/${rifaStore.rifasDisponibles.length}`)
    
    const numerosGanadores = []
    const vendedoresGanadores = new Map()
    
         console.log(`\n🧪 EJECUTANDO ${cantidadPruebas} SORTEOS...`)
    
    for (let i = 0; i < cantidadPruebas; i++) {
      const rifasDisponibles = rifaStore.rifasDisponibles
      if (rifasDisponibles.length > 0) {
        // Usar el mismo algoritmo profesional que el sorteo real
        const rifaGanadora = seleccionarGanadorProfesional()
        numerosGanadores.push(rifaGanadora.numero)
        
        // Contar ganancias por vendedor
        const vendedor = rifaGanadora.vendedor
        vendedoresGanadores.set(vendedor, (vendedoresGanadores.get(vendedor) || 0) + 1)
        
        if (i % 10 === 0) {
          console.log(`📊 Progreso: ${i + 1}/${cantidadPruebas} sorteos completados`)
        }
      }
    }
    
    console.log(`=== PRUEBA DE DISTRIBUCIÓN (${cantidadPruebas} sorteos) ===`)
    verificarDistribucion(numerosGanadores)
    
    // Verificar distribución de números bajos vs altos
    const mitad = Math.max(...numerosGanadores) / 2
    const numerosBajos = numerosGanadores.filter(n => n <= mitad).length
    const numerosAltos = numerosGanadores.filter(n => n > mitad).length
    
         console.log(`Números bajos (1-${Math.floor(mitad)}): ${numerosBajos} (${((numerosBajos/cantidadPruebas)*100).toFixed(1)}%)`)
     console.log(`Números altos (${Math.floor(mitad)+1}-${Math.max(...numerosGanadores)}): ${numerosAltos} (${((numerosAltos/cantidadPruebas)*100).toFixed(1)}%)`)
     console.log(`Balance: ${Math.abs(numerosBajos - numerosAltos)} diferencia`)
     
     // Análisis de vendedores
     console.log(`\n👥 ANÁLISIS DE VENDEDORES:`)
     console.log(`Total de vendedores únicos ganadores: ${vendedoresGanadores.size}`)
     
     // Mostrar vendedores con más ganancias
     const vendedoresOrdenados = Array.from(vendedoresGanadores.entries())
       .sort((a, b) => b[1] - a[1])
       .slice(0, 5)
     
     console.log(`\n🏆 TOP 5 VENDEDORES CON MÁS GANANCIAS:`)
     vendedoresOrdenados.forEach(([vendedor, ganancias], index) => {
       console.log(`${index + 1}. ${vendedor}: ${ganancias} premios (${((ganancias/cantidadPruebas)*100).toFixed(1)}%)`)
     })
     
     // Análisis de distribución
     const maxGanancias = Math.max(...vendedoresGanadores.values())
     const minGanancias = Math.min(...vendedoresGanadores.values())
     const promedioGanancias = cantidadPruebas / vendedoresGanadores.size
     
     console.log(`\n📊 ESTADÍSTICAS DE DISTRIBUCIÓN:`)
     console.log(`Máximo premios por vendedor: ${maxGanancias}`)
     console.log(`Mínimo premios por vendedor: ${minGanancias}`)
     console.log(`Promedio de premios por vendedor: ${promedioGanancias.toFixed(2)}`)
     console.log(`Diferencia máxima-mínimo: ${maxGanancias - minGanancias}`)
     
     return { 
       numerosGanadores, 
       numerosBajos, 
       numerosAltos, 
       vendedoresUnicos: vendedoresGanadores.size,
       vendedoresGanadores: Object.fromEntries(vendedoresGanadores)
     }
   }

      // Función simple para probar la aleatoriedad
   const probarDistribucionPequena = (cantidadPruebas = 4) => {
     console.log(`\n🎲 PRUEBA DE ALEATORIEDAD SIMPLE`)
     console.log(`Rifas disponibles: ${rifaStore.rifasDisponibles.length}`)
     console.log(`Probabilidad por rifa: 1/${rifaStore.rifasDisponibles.length}`)
     
     const numerosGanadores = []
     
     for (let i = 0; i < cantidadPruebas; i++) {
       const rifaGanadora = seleccionarGanadorProfesional()
       numerosGanadores.push(rifaGanadora.numero)
       console.log(`Sorteo ${i + 1}: ${rifaGanadora.numero}`)
     }
     
     console.log(`\n📊 RESULTADOS: ${numerosGanadores.join(', ')}`)
     
     // Verificar si hay repeticiones
     const numerosUnicos = new Set(numerosGanadores)
     if (numerosUnicos.size < numerosGanadores.length) {
       console.log(`⚠️ REPETICIÓN DETECTADA: ${numerosGanadores.length - numerosUnicos.size} números repetidos`)
     } else {
       console.log(`✅ Todos los números son únicos`)
     }
     
     return { numerosGanadores }
   }

  // Generar secuencia de números para mostrar
  const generarSecuencia = (cantidad = 20) => {
    const numeros = []
    const rifasDisponibles = rifaStore.rifasDisponibles
    
    if (rifasDisponibles.length === 0) return numeros

    // Mezclar las rifas disponibles usando Fisher-Yates
    const rifasMezcladas = mezclarArray(rifasDisponibles)
    
    // Seleccionar números únicos para evitar repeticiones
    const numerosUsados = new Set()
    let intentos = 0
    const maxIntentos = cantidad * 3 // Evitar bucle infinito
    
         while (numeros.length < Math.min(cantidad, rifasMezcladas.length) && intentos < maxIntentos) {
       // Selección simple y uniforme
       const indiceAleatorio = Math.floor(Math.random() * rifasMezcladas.length)
       const numero = rifasMezcladas[indiceAleatorio].numero
      
      if (!numerosUsados.has(numero)) {
        numeros.push(numero)
        numerosUsados.add(numero)
      }
      intentos++
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

  // Realizar sorteo con animación - ALGORITMO PROFESIONAL
  const realizarSorteoConAnimacion = async (duracion = 3000) => {
    try {
      estaSorteando.value = true
      numerosMostrados.value = []
      
      // 1. Seleccionar ganador usando algoritmo profesional
      const rifaGanadora = seleccionarGanadorProfesional()
      const numeroGanador = rifaGanadora.numero
      
      console.log(`🎯 GANADOR SELECCIONADO: Número ${numeroGanador} - Vendedor: ${rifaGanadora.vendedor}`)
      
      // 2. Generar secuencia de animación profesional
      const secuencia = []
      const numerosUsados = new Set([numeroGanador])
      const rifasDisponibles = rifaStore.rifasDisponibles
      
      // Mezclar criptográficamente las rifas para la animación
      const rifasMezcladas = mezclarArrayCriptografico(rifasDisponibles)
      
      // Generar 35 números únicos para la animación
      let intentos = 0
      const maxIntentos = 1000
      
      while (secuencia.length < 35 && intentos < maxIntentos) {
        const indiceAleatorio = generarNumeroCriptografico(0, rifasMezcladas.length - 1)
        const numero = rifasMezcladas[indiceAleatorio].numero
        
        if (!numerosUsados.has(numero)) {
          secuencia.push(numero)
          numerosUsados.add(numero)
        }
        intentos++
      }
      
      // 3. Agregar el ganador al final
      secuencia.push(numeroGanador)
      
      // 4. Mostrar animación con velocidad variable
      for (let i = 0; i < secuencia.length; i++) {
        numeroActual.value = secuencia[i]
        numerosMostrados.value.push(secuencia[i])
        
        // Velocidad variable para crear drama
        let delay
        if (i < 10) {
          delay = 200 // Inicio lento
        } else if (i < 25) {
          delay = 150 // Aceleración media
        } else if (i < 30) {
          delay = 100 // Aceleración alta
        } else {
          delay = 80 // Final muy rápido
        }
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      // 5. Realizar el sorteo real
      const resultado = await sorteoStore.realizarSorteo(numeroGanador)
      
      if (resultado.success) {
        console.log(`✅ SORTEO COMPLETADO: ${rifaGanadora.comprador} ganó con el número ${numeroGanador}`)
        return resultado
      } else {
        throw new Error(resultado.error)
      }
    } catch (error) {
      console.error('❌ Error en sorteo con animación:', error)
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
         mezclarArray: mezclarArrayCriptografico,
     generarSecuencia,
     verificarDistribucion,
     probarDistribucionSorteo,
     probarDistribucionPequena,
     probarDistribucionSimple,
     probarDistribucionFisherYates,
     diagnosticarAleatoriedad,
     seleccionarGanadorProfesional,
     generarNumeroCriptografico
  }
} 