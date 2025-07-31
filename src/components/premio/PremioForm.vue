<template>
  <Card variant="elevated" padding="lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-900">Cargar Premio</h3>
        <Button 
          variant="outline" 
          size="sm"
          @click="mostrarFormularioLote = !mostrarFormularioLote"
        >
          {{ mostrarFormularioLote ? 'Formulario Individual' : 'Carga en Lote' }}
        </Button>
      </div>
    </template>

    <!-- Formulario Individual -->
    <div v-if="!mostrarFormularioLote" class="space-y-6">
      <Input
        v-model="form.nombre"
        label="Nombre del Premio"
        placeholder="Ej: Bicicleta, TV, Viaje, etc."
        required
        :error="errors.nombre"
        @keyup.enter="agregarPremio"
      />

      <Input
        v-model="form.descripcion"
        label="Descripción"
        placeholder="Descripción detallada del premio"
        :error="errors.descripcion"
        @keyup.enter="agregarPremio"
      />

      <Input
        v-model="form.orden"
        label="Orden de Sorteo"
        type="number"
        placeholder="1"
        :error="errors.orden"
        @keyup.enter="agregarPremio"
      />

      <!-- Upload de imagen -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Imagen del Premio (Opcional)
        </label>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />
            <Button 
              variant="outline" 
              @click="$refs.fileInput.click()"
              fullWidth
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </template>
              Seleccionar Imagen
            </Button>
          </div>
          <div v-if="imagenPreview" class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden border premio-imagen">
            <img 
              :src="imagenPreview" 
              alt="Preview" 
              class="w-full h-full object-contain transition-opacity duration-300"
              @error="handlePreviewError"
              @load="handlePreviewLoad"
            />
            <div v-if="previewError" class="w-full h-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        <p v-if="form.imagen" class="text-sm text-gray-500 mt-1">
          Imagen seleccionada: {{ form.imagen.name }}
        </p>
      </div>

      <div class="flex justify-end space-x-3">
        <Button 
          variant="outline" 
          @click="limpiarFormulario"
        >
          Limpiar
        </Button>
        <Button 
          variant="primary" 
          :loading="loading"
          @click="agregarPremio"
        >
          Agregar Premio
        </Button>
      </div>
    </div>

    <!-- Formulario en Lote -->
    <div v-else class="space-y-6">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-medium text-blue-900 mb-2">Instrucciones para carga en lote:</h4>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• Formato: Nombre, Descripción, Orden</li>
          <li>• Un registro por línea</li>
          <li>• Separar campos con comas</li>
          <li>• Ejemplo: Bicicleta, Rodado 29, 1</li>
        </ul>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Datos en Lote
        </label>
        <textarea
          v-model="datosLote"
          rows="10"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Bicicleta, Rodado 29, 1&#10;TV 50, Smart TV, 2&#10;Viaje, 7 días a Brasil, 3"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3">
        <Button 
          variant="outline" 
          @click="limpiarLote"
        >
          Limpiar
        </Button>
        <Button 
          variant="primary" 
          :loading="loading"
          @click="agregarPremiosEnLote"
        >
          Cargar Premios en Lote
        </Button>
      </div>
    </div>

    <!-- Mensaje de éxito/error -->
    <div v-if="mensaje" class="mt-4 p-4 rounded-lg" :class="mensajeClases">
      {{ mensaje }}
    </div>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePremioStore } from '../../stores/premioStore'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'

const premioStore = usePremioStore()

// Estado
const mostrarFormularioLote = ref(false)
const loading = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('success')
const imagenPreview = ref('')
const previewError = ref(false)

const form = ref({
  nombre: '',
  descripcion: '',
  orden: '',
  imagen: null
})

const datosLote = ref('')
const errors = ref({})

// Computed
const mensajeClases = computed(() => {
  return mensajeTipo.value === 'success' 
    ? 'bg-green-50 text-green-800 border border-green-200'
    : 'bg-red-50 text-red-800 border border-red-200'
})

// Métodos
const validarFormulario = () => {
  errors.value = {}
  
  if (!form.value.nombre || form.value.nombre.trim() === '') {
    errors.value.nombre = 'El nombre del premio es obligatorio'
  }
  
  if (form.value.orden && (isNaN(form.value.orden) || parseInt(form.value.orden) <= 0)) {
    errors.value.orden = 'El orden debe ser un número positivo'
  }
  
  return Object.keys(errors.value).length === 0
}

const mostrarMensaje = (texto, tipo = 'success') => {
  mensaje.value = texto
  mensajeTipo.value = tipo
  setTimeout(() => {
    mensaje.value = ''
  }, 5000)
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      mostrarMensaje('Por favor, selecciona un archivo de imagen válido', 'error')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      mostrarMensaje('La imagen debe ser menor a 5MB', 'error')
      return
    }

    form.value.imagen = file
    previewError.value = false
    
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagenPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handlePreviewError = () => {
  previewError.value = true
}

const handlePreviewLoad = () => {
  previewError.value = false
}

const agregarPremio = async () => {
  if (!validarFormulario()) {
    mostrarMensaje('Por favor, corrige los errores en el formulario', 'error')
    return
  }

  try {
    loading.value = true
    
    const premioData = {
      nombre: form.value.nombre.trim(),
      descripcion: form.value.descripcion?.trim() || '',
      orden: form.value.orden ? parseInt(form.value.orden) : undefined
    }

    const resultado = await premioStore.agregarPremio(premioData, form.value.imagen)

    if (resultado.success) {
      mostrarMensaje(`Premio "${form.value.nombre}" agregado exitosamente`)
      limpiarFormulario()
    } else {
      mostrarMensaje(resultado.error, 'error')
    }
  } catch (error) {
    mostrarMensaje('Error al agregar el premio', 'error')
  } finally {
    loading.value = false
  }
}

const agregarPremiosEnLote = async () => {
  if (!datosLote.value.trim()) {
    mostrarMensaje('Por favor, ingresa los datos en lote', 'error')
    return
  }

  try {
    loading.value = true
    
    const lineas = datosLote.value.trim().split('\n')
    const premiosData = []
    const errores = []

    lineas.forEach((linea, index) => {
      const campos = linea.split(',').map(campo => campo.trim())
      
      if (campos.length < 2) {
        errores.push(`Línea ${index + 1}: Mínimo nombre y orden requeridos`)
        return
      }

      const [nombre, descripcion = '', orden = ''] = campos
      
      if (!nombre) {
        errores.push(`Línea ${index + 1}: Nombre es obligatorio`)
        return
      }

      if (orden && (isNaN(orden) || parseInt(orden) <= 0)) {
        errores.push(`Línea ${index + 1}: Orden inválido`)
        return
      }

      premiosData.push({
        nombre,
        descripcion,
        orden: orden ? parseInt(orden) : undefined
      })
    })

    if (errores.length > 0) {
      mostrarMensaje(`Errores encontrados:\n${errores.join('\n')}`, 'error')
      return
    }

    let exitosos = 0
    let fallidos = 0

    for (const premio of premiosData) {
      const resultado = await premioStore.agregarPremio(premio)
      if (resultado.success) {
        exitosos++
      } else {
        fallidos++
      }
    }

    if (fallidos === 0) {
      mostrarMensaje(`${exitosos} premios agregados exitosamente`)
      limpiarLote()
    } else {
      mostrarMensaje(`${exitosos} premios agregados, ${fallidos} con errores`, 'error')
    }
  } catch (error) {
    mostrarMensaje('Error al procesar los premios en lote', 'error')
  } finally {
    loading.value = false
  }
}

const limpiarFormulario = () => {
  form.value = {
    nombre: '',
    descripcion: '',
    orden: '',
    imagen: null
  }
  errors.value = {}
  mensaje.value = ''
  imagenPreview.value = ''
  previewError.value = false
  if (this.$refs.fileInput) {
    this.$refs.fileInput.value = ''
  }
}

const limpiarLote = () => {
  datosLote.value = ''
  mensaje.value = ''
}
</script>

<style scoped>
/* Estilos para las imágenes de premios */
.premio-imagen {
  transition: all 0.3s ease;
  position: relative;
}

.premio-imagen:hover {
  transform: scale(1.05);
}

.premio-imagen img {
  transition: opacity 0.3s ease;
  backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.premio-imagen img:hover {
  opacity: 0.9;
}
</style> 