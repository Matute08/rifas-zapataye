import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const usePremioStore = defineStore('premio', () => {
  // Estado
  const premios = ref([])
  const premiosSorteados = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const premiosDisponibles = computed(() => {
    return premios.value.filter(premio => 
      !premiosSorteados.value.some(sorteado => sorteado.premioId === premio.id)
    ).sort((a, b) => b.orden - a.orden)
  })

  const totalPremios = computed(() => premios.value.length)
  
  const premiosSorteadosCount = computed(() => premiosSorteados.value.length)
  
  const premiosPendientes = computed(() => premiosDisponibles.value.length)

  const premiosPorCategoria = computed(() => {
    const categorias = {}
    premios.value.forEach(premio => {
      const categoria = premio.categoria || 'Sin categoría'
      if (!categorias[categoria]) {
        categorias[categoria] = []
      }
      categorias[categoria].push(premio)
    })
    return categorias
  })

  const premioMasValioso = computed(() => {
    if (premios.value.length === 0) return null
    return premios.value.reduce((max, premio) => 
      premio.valor > max.valor ? premio : max
    )
  })

  const premioMenosValioso = computed(() => {
    if (premios.value.length === 0) return null
    return premios.value.reduce((min, premio) => 
      premio.valor < min.valor ? premio : min
    )
  })

  // Actions
  // Cargar premios desde Supabase
  const cargarPremios = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.from('premios').select('*').order('orden', { ascending: false })
      if (err) throw err
      premios.value = data || []
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Agregar premio a Supabase
  const agregarPremio = async (premio, archivoImagen) => {
    console.log('[PREMIO] INICIO agregarPremio', { premio, archivoImagen });
    loading.value = true
    error.value = null
    try {
      let imagenUrl = null
      if (archivoImagen) {
        const nombreArchivo = `${Date.now()}_${archivoImagen.name}`
        console.log('[PREMIO] Subiendo imagen:', { nombreArchivo, archivoImagen })
        const { data: imgData, error: imgErr } = await supabase.storage.from('premios').upload(nombreArchivo, archivoImagen, { upsert: true })
        if (imgErr) throw imgErr
        const { data: urlData } = supabase.storage.from('premios').getPublicUrl(nombreArchivo)
        imagenUrl = urlData.publicUrl
      }
      // Insertar premio (sin categoria)
      const insertObj = {
        nombre: premio.nombre,
        descripcion: premio.descripcion || '',
        orden: premio.orden,
        imagen: imagenUrl
      }
      console.log('[PREMIO] Insertando en Supabase:', insertObj)
      const { data, error: err } = await supabase.from('premios').insert([
        insertObj
      ]).select()
      if (err) throw err
      if (data && data[0]) premios.value.unshift(data[0])
      return { success: true, premio: data[0] }
    } catch (err) {
      console.error('[PREMIO] ERROR en agregarPremio:', err);
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Actualizar premio en Supabase
  const actualizarPremio = async (id, datos, archivoImagen) => {
    loading.value = true
    error.value = null
    try {
      let imagenUrl = datos.imagen || null
      if (archivoImagen) {
        const nombreArchivo = `${Date.now()}_${archivoImagen.name}`
        const { data: imgData, error: imgErr } = await supabase.storage.from('premios').upload(nombreArchivo, archivoImagen, { upsert: true })
        if (imgErr) throw imgErr
        const { data: urlData } = supabase.storage.from('premios').getPublicUrl(nombreArchivo)
        imagenUrl = urlData.publicUrl
      }
      // Actualizar solo los campos existentes
      const updateObj = {
        nombre: datos.nombre,
        descripcion: datos.descripcion || '',
        orden: datos.orden,
        imagen: imagenUrl
      }
      const { data, error: err } = await supabase.from('premios').update(updateObj).eq('id', id).select()
      if (err) throw err
      // Actualizar local
      const idx = premios.value.findIndex(p => p.id === id)
      if (idx !== -1 && data && data[0]) premios.value[idx] = data[0]
      return { success: true, premio: data[0] }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Eliminar premio en Supabase
  const eliminarPremio = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.from('premios').delete().eq('id', id)
      if (err) throw err
      premios.value = premios.value.filter(p => p.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  const marcarComoSorteado = (premioId, rifaGanadora) => {
    // Evitar duplicados
    if (premiosSorteados.value.some(sorteado => sorteado.premioId === premioId)) {
      console.warn('Intento de marcar como sorteado un premio ya sorteado:', premioId)
      return false
    }
    const premio = premios.value.find(p => p.id === premioId)
    if (premio) {
      const sorteo = {
        premioId,
        rifaGanadora,
        fechaSorteo: new Date().toISOString(),
        premio: premio
      }
      premiosSorteados.value.push(sorteo)
      guardarEnLocalStorage()
      // LOG para depuración
      console.log('Premio sorteado:', premioId)
      console.log('PremiosSorteados:', premiosSorteados.value.map(p => p.premioId))
      console.log('PremiosDisponibles:', premiosDisponibles.value.map(p => p.id))
      return true
    }
    return false
  }

  const obtenerPremioPorId = (id) => {
    return premios.value.find(p => p.id === id)
  }

  const obtenerPremioPorOrden = (orden) => {
    return premios.value.find(p => p.orden === orden)
  }

  const buscarPremios = (termino) => {
    const terminoLower = termino.toLowerCase()
    return premios.value.filter(premio => 
      premio.nombre.toLowerCase().includes(terminoLower) ||
      premio.descripcion.toLowerCase().includes(terminoLower) ||
      premio.categoria.toLowerCase().includes(terminoLower)
    )
  }

  const reordenarPremios = (nuevoOrden) => {
    try {
      nuevoOrden.forEach((item, index) => {
        const premio = premios.value.find(p => p.id === item.id)
        if (premio) {
          premio.orden = index + 1
        }
      })
      
      // Ordenar el array por el nuevo orden
      premios.value.sort((a, b) => a.orden - b.orden)
      guardarEnLocalStorage()
      return true
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const limpiarPremios = () => {
    premios.value = []
    premiosSorteados.value = []
    guardarEnLocalStorage()
  }

  const resetearSorteos = () => {
    premiosSorteados.value = []
    guardarEnLocalStorage()
  }

  // Persistencia
  const guardarEnLocalStorage = () => {
    try {
      localStorage.setItem('premios', JSON.stringify(premios.value))
      localStorage.setItem('premiosSorteados', JSON.stringify(premiosSorteados.value))
    } catch (err) {
      console.error('Error al guardar en localStorage:', err)
    }
  }

  const cargarDesdeLocalStorage = () => {
    try {
      const premiosGuardados = localStorage.getItem('premios')
      const sorteadosGuardados = localStorage.getItem('premiosSorteados')
      
      if (premiosGuardados) {
        premios.value = JSON.parse(premiosGuardados)
      }
      
      if (sorteadosGuardados) {
        premiosSorteados.value = JSON.parse(sorteadosGuardados)
      }
    } catch (err) {
      console.error('Error al cargar desde localStorage:', err)
    }
  }

  const exportarPremios = () => {
    const datos = {
      premios: premios.value,
      sorteados: premiosSorteados.value,
      fechaExportacion: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `premios-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importarPremios = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const datos = JSON.parse(e.target.result)
          if (datos.premios) {
            // Regenerar ids y orden únicos para cada premio importado
            let ordenBase = 1
            premios.value = datos.premios.map((p, idx) => ({
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9) + '-' + idx,
              nombre: p.nombre,
              descripcion: p.descripcion,
              valor: p.valor,
              categoria: p.categoria,
              imagen: p.imagen,
              orden: ordenBase++,
              fechaCreacion: p.fechaCreacion || new Date().toISOString()
            }))
          }
          if (datos.sorteados) {
            premiosSorteados.value = [] // No importar sorteados para evitar inconsistencias
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
  cargarPremios()

  return {
    // Estado
    premios,
    premiosSorteados,
    loading,
    error,
    
    // Getters
    premiosDisponibles,
    totalPremios,
    premiosSorteadosCount,
    premiosPendientes,
    premiosPorCategoria,
    premioMasValioso,
    premioMenosValioso,
    
    // Actions
    cargarPremios,
    agregarPremio,
    actualizarPremio,
    eliminarPremio,
    marcarComoSorteado,
    obtenerPremioPorId,
    obtenerPremioPorOrden,
    buscarPremios,
    reordenarPremios,
    limpiarPremios,
    resetearSorteos,
    exportarPremios,
    importarPremios
  }
}) 