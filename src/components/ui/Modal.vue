<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div :class="modalClasses">
            <!-- Header -->
            <div v-if="$slots.header || title" class="modal-header">
              <h3 v-if="title" class="modal-title">{{ title }}</h3>
              <slot name="header"></slot>
              <button
                v-if="showCloseButton"
                @click="$emit('update:modelValue', false)"
                class="modal-close"
                type="button"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const modalClasses = computed(() => {
  const baseClasses = 'bg-white rounded-xl shadow-2xl transform transition-all duration-300'
  
  const sizeClasses = {
    sm: 'max-w-md w-full mx-4',
    md: 'max-w-lg w-full mx-4',
    lg: 'max-w-2xl w-full mx-4',
    xl: 'max-w-4xl w-full mx-4',
    full: 'w-full h-full rounded-none'
  }
  
  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
  backdrop-filter: blur(4px);
}

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: auto;
  max-width: 100vw;
  /* Elimina w-full para evitar que el modal se pegue a la izquierda */
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors duration-200;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

/* Transiciones */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style> 