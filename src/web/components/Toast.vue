<script setup lang="ts">
defineProps<{
  modelValue?: boolean
}>()
</script>

<template>
  <div
    :class="modelValue ? '' : 'translate-y-[-10px] opacity-0'"
    class="fixed top-0 left-0 right-0 pointer-events-none transition-all flex items-center justify-center"
  >
    <slot />
  </div>
</template>
