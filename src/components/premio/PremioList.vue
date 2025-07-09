<template>
  <Card variant="elevated" padding="lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-900">Lista de Premios</h3>
        <div class="flex items-center space-x-3">
          <!-- Búsqueda -->
          <div class="relative">
            <input
              v-model="terminoBusqueda"
              type="text"
              placeholder="Buscar premios..."
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
        <input type="checkbox" v-model="todosSeleccionados" class="mr-2" />
        <span class="mr-4">Seleccionar todos</span>
        <Button variant="danger" :disabled="seleccionados.length === 0" @click="eliminarSeleccionados">
          Eliminar seleccionados
        </Button>
      </div>
    </template>

    <!-- Lista de Premios -->
    <div v-if="premiosFiltrados.length > 0" class="space-y-4">
      <div
        v-for="premio in premiosFiltrados"
        :key="premio.id"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        :class="{ 'bg-green-50 border-green-200': esSorteado(premio.id) }"
      >
        <div class="flex items-center space-x-4">
          <!-- Checkbox individual -->
          <input type="checkbox" :value="premio.id" v-model="seleccionados" class="mr-2" />
          <!-- Imagen del Premio -->
          <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <svg v-if="!premio.imagen" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <img v-else :src="premio.imagen" :alt="premio.nombre" class="w-full h-full object-cover rounded-lg" />
          </div>
          
          <!-- Información -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="font-semibold text-gray-900">{{ premio.nombre }}</h4>
              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Orden {{ premio.orden }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-1">{{ premio.descripcion }}</p>
            
          </div>
        </div>
        
        <!-- Estado y Acciones -->
        <div class="flex items-center space-x-4">
          <!-- Estado -->
          <div class="flex items-center space-x-2">
            <div v-if="esSorteado(premio.id)" class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-green-600 font-medium">Sorteado</span>
            </div>
            <div v-else class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-blue-600 font-medium">Pendiente</span>
            </div>
          </div>
          
          <!-- Acciones -->
          <div class="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              @click="verDetalles(premio)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              @click="editarPremio(premio)"
            >
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </Button>
            
            <Button
              v-if="!esSorteado(premio.id)"
              variant="ghost"
              size="sm"
              @click="eliminarPremio(premio.id)"
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
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay premios</h3>
      <p class="text-gray-500">
        {{ terminoBusqueda ? 'No se encontraron premios con los filtros aplicados' : 'Agrega tu primer premio para comenzar' }}
      </p>
    </div>

    <!-- Modal de Detalles -->
    <Modal v-model="mostrarDetalles" title="Detalles del Premio" size="md">
      <div v-if="premioSeleccionado" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <p class="text-lg font-semibold text-gray-900">{{ premioSeleccionado.nombre }}</p>
          </div>
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Valor</label>
            <p class="text-lg font-semibold text-green-600">${{ premioSeleccionado.valor?.toLocaleString() }}</p>
          </div> -->
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <p class="text-gray-900">{{ premioSeleccionado.descripcion || 'Sin descripción' }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Orden de Sorteo</label>
            <p class="text-gray-900">{{ premioSeleccionado.orden }}</p>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado</label>
          <p class="text-lg font-semibold" :class="esSorteado(premioSeleccionado.id) ? 'text-green-600' : 'text-blue-600'">
            {{ esSorteado(premioSeleccionado.id) ? 'Sorteado' : 'Pendiente' }}
          </p>
        </div>
        
       
      </div>
      
      <template #footer>
        <Button variant="outline" @click="mostrarDetalles = false">
          Cerrar
        </Button>
      </template>
    </Modal>

    <!-- Modal de Edición -->
    <Modal v-model="mostrarEdicion" title="Editar Premio" size="md">
      <div v-if="premioEditando" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="editForm.nombre" type="text" class="w-full border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="editForm.descripcion" class="w-full border rounded px-3 py-2 mt-1"></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Orden</label>
          <input v-model="editForm.orden" type="number" min="1" class="w-full border rounded px-3 py-2 mt-1" />
        </div>
        <div v-if="editForm.imagen || editImagenPreview" class="flex flex-col items-center">
          <label class="block text-sm font-medium text-gray-700">Imagen actual</label>
          <img :src="editImagenPreview || editForm.imagen" alt="Imagen Premio" class="w-32 h-32 object-cover rounded-lg border mb-2" />
        </div>
        <div class="flex flex-col items-center">
          <label class="block text-sm font-medium text-gray-700">Cambiar imagen</label>
          <input type="file" accept="image/*" @change="handleEditFileUpload" />
          <span v-if="editForm.nuevaImagen" class="text-xs text-gray-500 mt-1">Imagen seleccionada: {{ editForm.nuevaImagen.name }}</span>
        </div>
        <div v-if="editError" class="text-red-600 text-sm">{{ editError }}</div>
        <div v-if="editSuccess" class="text-green-600 text-sm">{{ editSuccess }}</div>
      </div>
      <template #footer>
        <Button variant="outline" @click="mostrarEdicion = false">Cancelar</Button>
        <Button variant="primary" @click="guardarEdicion">Guardar Cambios</Button>
      </template>
    </Modal>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePremioStore } from '../../stores/premioStore'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'
import Swal from 'sweetalert2'

const premioStore = usePremioStore()

// Estado
const terminoBusqueda = ref('')
const mostrarDetalles = ref(false)
const premioSeleccionado = ref(null)

// Edición
const mostrarEdicion = ref(false)
const premioEditando = ref(null)
const editForm = ref({ nombre: '', descripcion: '', categoria: '', orden: '' })
const editError = ref('')
const editSuccess = ref('')
const editImagenPreview = ref('')

// Selección múltiple
const seleccionados = ref([])

const todosSeleccionados = computed({
  get() {
    return premiosFiltrados.value.length > 0 && premiosFiltrados.value.every(p => seleccionados.value.includes(p.id))
  },
  set(valor) {
    if (valor) {
      seleccionados.value = premiosFiltrados.value.map(p => p.id)
    } else {
      seleccionados.value = []
    }
  }
})

// Computed
const premiosFiltrados = computed(() => {
  let premios = premioStore.premios

  // Aplicar búsqueda
  if (terminoBusqueda.value) {
    premios = premioStore.buscarPremios(terminoBusqueda.value)
  }

  // Elimina el select de categoría y orden, y su lógica asociada en el script.
  // Aplicar ordenamiento
  premios = [...premios].sort((a, b) => {
    return a.orden - b.orden
  })

  return premios
})

// Métodos
const esSorteado = (premioId) => {
  return premioStore.premiosSorteados.some(sorteado => sorteado.premioId === premioId)
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

const verDetalles = (premio) => {
  premioSeleccionado.value = premio
  mostrarDetalles.value = true
}

const handleEditFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      editError.value = 'Por favor, selecciona un archivo de imagen válido'
      return
    }
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      editError.value = 'La imagen debe ser menor a 5MB'
      return
    }
    editForm.value.nuevaImagen = file
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      editImagenPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const editarPremio = async (premio) => {
  let premioActualizado = premio
  if (premioStore.obtenerPremioPorId) {
    const encontrado = premioStore.obtenerPremioPorId(premio.id)
    if (encontrado) premioActualizado = encontrado
  }
  premioEditando.value = premioActualizado
  editForm.value = {
    nombre: premioActualizado.nombre || '',
    descripcion: premioActualizado.descripcion || '',
    orden: premioActualizado.orden || '',
    imagen: premioActualizado.imagen || '',
    nuevaImagen: null
  }
  editImagenPreview.value = ''
  editError.value = ''
  editSuccess.value = ''
  mostrarEdicion.value = true
}

const guardarEdicion = async () => {
  editError.value = ''
  editSuccess.value = ''
  if (!editForm.value.nombre || editForm.value.nombre.trim() === '') {
    editError.value = 'El nombre es obligatorio.'
    return
  }
  if (!editForm.value.orden || isNaN(editForm.value.orden) || parseInt(editForm.value.orden) <= 0) {
    editError.value = 'El orden debe ser un número positivo.'
    return
  }
  // Enviar nueva imagen si se seleccionó
  const res = await premioStore.actualizarPremio(
    premioEditando.value.id,
    {
      nombre: editForm.value.nombre.trim(),
      descripcion: editForm.value.descripcion?.trim() || '',
      categoria: editForm.value.categoria?.trim() || 'General',
      orden: parseInt(editForm.value.orden),
      imagen: editForm.value.imagen // para mantener la actual si no se cambia
    },
    editForm.value.nuevaImagen // archivo o null
  )
  if (res.success) {
    editSuccess.value = 'Premio actualizado correctamente.'
    mostrarEdicion.value = false
  } else {
    editError.value = res.error || 'Error al actualizar.'
  }
}

const eliminarPremio = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Estás seguro de que quieres eliminar este premio?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      premioStore.eliminarPremio(id)
      Swal.fire('Eliminado', 'El premio ha sido eliminado.', 'success')
    }
  })
}

const eliminarSeleccionados = () => {
  if (seleccionados.value.length === 0) return
  Swal.fire({
    title: '¿Eliminar premios seleccionados?',
    text: `Se eliminarán ${seleccionados.value.length} premios. ¿Estás seguro?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      seleccionados.value.forEach(id => premioStore.eliminarPremio(id))
      seleccionados.value = []
      Swal.fire('Eliminados', 'Los premios seleccionados han sido eliminados.', 'success')
    }
  })
}
</script> 

<style scoped>
/* Inputs con texto negro */
input[type="text"],
input[type="number"],
textarea {
  color: #111 !important;
  background: #fff;
}
</style> 