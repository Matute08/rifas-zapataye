<template>
  <div class="input-container">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="input-wrapper">
      <div v-if="$slots.prefix" class="input-prefix">
        <slot name="prefix"></slot>
      </div>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[inputClasses, 'text-gray-900']"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="$emit('enter')"
      />
      
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <div v-if="error || hint" class="input-message">
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <p v-else-if="hint" class="text-gray-500 text-sm">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'enter'])

const inputClasses = computed(() => {
  const baseClasses = 'w-full bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const stateClasses = props.error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  
  const disabledClass = props.disabled ? 'bg-gray-50 cursor-not-allowed' : ''
  
  return [
    baseClasses,
    sizeClasses[props.size],
    stateClasses,
    disabledClass
  ].join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}
</script>

<style scoped>
.input-container {
  @apply w-full;
}

.input-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.input-wrapper {
  @apply relative flex items-center;
}

.input-prefix {
  @apply absolute left-3 text-gray-400 pointer-events-none;
}

.input-suffix {
  @apply absolute right-3 text-gray-400 pointer-events-none;
}

input:has(+ .input-suffix) {
  @apply pr-10;
}

input:has(.input-prefix + *) {
  @apply pl-10;
}

.input-message {
  @apply mt-1;
}
</style> 