<script setup lang="ts">
import { useMask } from '#/web/state.ts'
import { t } from '#/web/i18n.ts'

defineProps<{
  hint?: boolean
}>()
</script>

<template>
  <button
    :class="useMask ? 'text-primary' : hint ? 'opacity-50' : ''"
    @click="useMask = !useMask"
    class="square-btn gap-1 m-auto"
  >
    <div :class="useMask ? 'i-[carbon--view-off]' : 'i-[carbon--view]'" />
    {{ useMask ? t('mask-on') : t('mask-off') }}
  </button>
  <div v-if="hint" class="my-2 opacity-50">
    {{ t('dont-spoiler') }}
  </div>
</template>
