<template>
  <Card variant="elevated" padding="lg">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-900">Cargar Rifa</h3>
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          v-model="form.numero"
          label="Número de Rifa"
          type="number"
          placeholder="Ej: 001"
          required
          :error="errors.numero"
          @keyup.enter="agregarRifa"
        />
        
        <Input
          v-model="form.vendedor"
          label="Vendedor"
          placeholder="Nombre del vendedor"
          required
          :error="errors.vendedor"
          @keyup.enter="agregarRifa"
        />
      </div>

      <Input
        v-model="form.comprador"
        label="Comprador"
        placeholder="Nombre del comprador"
        required
        :error="errors.comprador"
        @keyup.enter="agregarRifa"
      />

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
          @click="agregarRifa"
        >
          Agregar Rifa
        </Button>
      </div>
    </div>

    <!-- Formulario en Lote -->
    <div v-else class="space-y-6">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-medium text-blue-900 mb-2">Instrucciones para carga en lote:</h4>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• Formato: Número, Vendedor, Comprador</li>
          <li>• Un registro por línea</li>
          <li>• Separar campos con comas</li>
          <li>• Ejemplo: 001, Juan Pérez, María García</li>
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
          placeholder="001, Juan Pérez, María García&#10;002, Ana López, Carlos Ruiz&#10;003, Pedro Gómez, Laura Torres"
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
          @click="agregarRifasEnLote"
        >
          Cargar Rifas en Lote
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
import { useRifaStore } from '../../stores/rifaStore'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'

const rifaStore = useRifaStore()

// Estado
const mostrarFormularioLote = ref(false)
const loading = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('success')

const form = ref({
  numero: '',
  vendedor: '',
  comprador: ''
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
  
  if (!form.value.numero || form.value.numero.trim() === '') {
    errors.value.numero = 'El número de rifa es obligatorio'
  } else if (isNaN(form.value.numero) || parseInt(form.value.numero) <= 0) {
    errors.value.numero = 'El número debe ser un valor positivo'
  }
  
  if (!form.value.vendedor || form.value.vendedor.trim() === '') {
    errors.value.vendedor = 'El vendedor es obligatorio'
  }
  
  if (!form.value.comprador || form.value.comprador.trim() === '') {
    errors.value.comprador = 'El comprador es obligatorio'
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

const agregarRifa = async () => {
  if (!validarFormulario()) {
    mostrarMensaje('Por favor, corrige los errores en el formulario', 'error')
    return
  }

  try {
    loading.value = true
    
    const resultado = rifaStore.agregarRifa({
      numero: parseInt(form.value.numero),
      vendedor: form.value.vendedor.trim(),
      comprador: form.value.comprador.trim()
    })

    if (resultado.success) {
      mostrarMensaje(`Rifa ${form.value.numero} agregada exitosamente`)
      limpiarFormulario()
    } else {
      mostrarMensaje(resultado.error, 'error')
    }
  } catch (error) {
    mostrarMensaje('Error al agregar la rifa', 'error')
  } finally {
    loading.value = false
  }
}

const agregarRifasEnLote = async () => {
  if (!datosLote.value.trim()) {
    mostrarMensaje('Por favor, ingresa los datos en lote', 'error')
    return
  }

  try {
    loading.value = true
    
    const lineas = datosLote.value.trim().split('\n')
    const rifasData = []
    const errores = []

    lineas.forEach((linea, index) => {
      const campos = linea.split(',').map(campo => campo.trim())
      
      if (campos.length !== 3) {
        errores.push(`Línea ${index + 1}: Formato incorrecto`)
        return
      }

      const [numero, vendedor, comprador] = campos
      
      if (!numero || !vendedor || !comprador) {
        errores.push(`Línea ${index + 1}: Todos los campos son obligatorios`)
        return
      }

      if (isNaN(numero) || parseInt(numero) <= 0) {
        errores.push(`Línea ${index + 1}: Número inválido`)
        return
      }

      rifasData.push({
        numero: parseInt(numero),
        vendedor,
        comprador
      })
    })

    if (errores.length > 0) {
      mostrarMensaje(`Errores encontrados:\n${errores.join('\n')}`, 'error')
      return
    }

    const resultados = await rifaStore.agregarRifasEnLote(rifasData)
    const exitosos = resultados.filter(r => r.success).length
    const fallidos = resultados.filter(r => !r.success).length

    if (fallidos === 0) {
      mostrarMensaje(`${exitosos} rifas agregadas exitosamente`)
      limpiarLote()
    } else {
      mostrarMensaje(`${exitosos} rifas agregadas, ${fallidos} con errores`, 'error')
    }
  } catch (error) {
    mostrarMensaje('Error al procesar las rifas en lote', 'error')
  } finally {
    loading.value = false
  }
}

const limpiarFormulario = () => {
  form.value = {
    numero: '',
    vendedor: '',
    comprador: ''
  }
  errors.value = {}
  mensaje.value = ''
}

const limpiarLote = () => {
  datosLote.value = ''
  mensaje.value = ''
}
</script> 