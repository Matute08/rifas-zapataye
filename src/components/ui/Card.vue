<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    
    <div class="card-body" :class="gradientTextClass">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined', 'gradient'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'rounded-xl transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    outlined: 'bg-white border-2 border-gray-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClass = props.hover ? 'hover:scale-105 hover:shadow-xl cursor-pointer' : ''
  
  return [
    baseClasses,
    variantClasses[props.variant],
    paddingClasses[props.padding],
    hoverClass
  ].join(' ')
})

const gradientTextClass = computed(() => {
  return props.variant === 'gradient' ? 'text-gray-900' : ''
})
</script>

<style scoped>
.card-header {
  @apply border-b border-gray-200 pb-4 mb-4;
}

.card-body {
  @apply flex-1;
}

.card-footer {
  @apply border-t border-gray-200 pt-4 mt-4;
}
</style> 