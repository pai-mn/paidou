<script setup lang="ts">
defineProps<{
  text: string
  value: string | number
}>()
</script>

<template>
  <div>
    <div class="text-3xl font-normal">
      {{ value }}
    </div>
    <div class="opacity-50 text-center">
      {{ text }}
    </div>
  </div>
</template>
