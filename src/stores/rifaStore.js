import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const useRifaStore = defineStore('rifa', () => {
  // Estado
  const rifas = ref([])
  const rifasGanadoras = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const rifasDisponibles = computed(() => {
    return rifas.value.filter(rifa => 
      !rifasGanadoras.value.some(ganadora => ganadora.numero === rifa.numero)
    )
  })

  const totalRifas = computed(() => rifas.value.length)
  
  const rifasVendidas = computed(() => rifas.value.length)
  
  const rifasGanadas = computed(() => rifasGanadoras.value.length)
  
  const rifasPendientes = computed(() => rifasDisponibles.value.length)

  const rifasPorVendedor = computed(() => {
    const vendedores = {}
    rifas.value.forEach(rifa => {
      if (!vendedores[rifa.vendedor]) {
        vendedores[rifa.vendedor] = []
      }
      vendedores[rifa.vendedor].push(rifa)
    })
    return vendedores
  })

  // Actions
  // Cargar rifas desde Supabase
  const cargarRifas = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('rifas').select('*').order('numero', { ascending: true })
      if (err) throw err
      rifas.value = data || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Agregar rifa a Supabase
  const agregarRifa = async (rifa) => {
    loading.value = true
    error.value = null
    try {
      // Validar que el número no exista
      const existe = rifas.value.some(r => r.numero === rifa.numero)
      if (existe) throw new Error(`Ya existe una rifa con el número ${rifa.numero}`)
      const { data, error: err } = await supabase.from('rifas').insert([
        {
          numero: parseInt(rifa.numero),
          vendedor: rifa.vendedor.trim(),
          comprador: rifa.comprador.trim()
        }
      ]).select()
      if (err) throw err
      if (data && data[0]) rifas.value.push(data[0])
      return { success: true, rifa: data[0] }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const agregarRifasEnLote = async (rifasData) => {
    loading.value = true
    error.value = null
    try {
      const resultados = []
      for (const rifa of rifasData) {
        const resultado = await agregarRifa(rifa)
        resultados.push(resultado)
      }
      return resultados
    } catch (err) {
      error.value = err.message
      return [{ success: false, error: err.message }]
    } finally {
      loading.value = false
    }
  }

  // Actualizar rifa en Supabase
  const actualizarRifa = async (id, datos) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('rifas').update({
        ...datos
      }).eq('id', id).select()
      if (err) throw err
      const idx = rifas.value.findIndex(r => r.id === id)
      if (idx !== -1 && data && data[0]) rifas.value[idx] = data[0]
      return { success: true, rifa: data[0] }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Eliminar rifa en Supabase
  const eliminarRifa = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('rifas').delete().eq('id', id)
      if (err) throw err
      rifas.value = rifas.value.filter(r => r.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  const marcarComoGanadora = (numero, premioId) => {
    const rifa = rifas.value.find(r => r.numero === numero)
    if (rifa) {
      const ganadora = {
        ...rifa,
        premioId,
        fechaGanada: new Date().toISOString()
      }
      rifasGanadoras.value.push(ganadora)
      guardarEnLocalStorage()
      return true
    }
    return false
  }

  const obtenerRifaPorNumero = (numero) => {
    return rifas.value.find(r => r.numero === numero)
  }

  const buscarRifas = (termino) => {
    const terminoLower = termino.toLowerCase()
    return rifas.value.filter(rifa => 
      rifa.numero.toString().includes(termino) ||
      rifa.vendedor.toLowerCase().includes(terminoLower) ||
      rifa.comprador.toLowerCase().includes(terminoLower)
    )
  }

  const limpiarRifas = () => {
    rifas.value = []
    rifasGanadoras.value = []
    guardarEnLocalStorage()
  }

  const resetearGanadoras = () => {
    rifasGanadoras.value = []
    guardarEnLocalStorage()
  }

  // Persistencia
  const guardarEnLocalStorage = () => {
    try {
      localStorage.setItem('rifas', JSON.stringify(rifas.value))
      localStorage.setItem('rifasGanadoras', JSON.stringify(rifasGanadoras.value))
    } catch (err) {
      console.error('Error al guardar en localStorage:', err)
    }
  }

  const cargarDesdeLocalStorage = () => {
    try {
      const rifasGuardadas = localStorage.getItem('rifas')
      const ganadorasGuardadas = localStorage.getItem('rifasGanadoras')
      
      if (rifasGuardadas) {
        rifas.value = JSON.parse(rifasGuardadas)
      }
      
      if (ganadorasGuardadas) {
        rifasGanadoras.value = JSON.parse(ganadorasGuardadas)
      }
    } catch (err) {
      console.error('Error al cargar desde localStorage:', err)
    }
  }

  const exportarRifas = () => {
    const datos = {
      rifas: rifas.value,
      ganadoras: rifasGanadoras.value,
      fechaExportacion: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rifas-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importarRifas = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const datos = JSON.parse(e.target.result)
          if (datos.rifas) {
            rifas.value = datos.rifas
          }
          if (datos.ganadoras) {
            rifasGanadoras.value = datos.ganadoras
          }
          guardarEnLocalStorage()
          resolve({ success: true })
        } catch (err) {
          reject(new Error('Error al importar el archivo'))
        }
      }
      reader.readAsText(archivo)
    })
  }

  // Inicializar
  cargarRifas()

  return {
    // Estado
    rifas,
    rifasGanadoras,
    loading,
    error,
    
    // Getters
    rifasDisponibles,
    totalRifas,
    rifasVendidas,
    rifasGanadas,
    rifasPendientes,
    rifasPorVendedor,
    
    // Actions
    cargarRifas,
    agregarRifa,
    agregarRifasEnLote,
    actualizarRifa,
    eliminarRifa,
    marcarComoGanadora,
    obtenerRifaPorNumero,
    buscarRifas,
    limpiarRifas,
    resetearGanadoras,
    exportarRifas,
    importarRifas
  }
}) 