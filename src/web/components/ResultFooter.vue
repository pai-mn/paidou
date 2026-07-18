<script setup lang="ts">
import { formatDuration, meta } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'
import { dayNoHanzi } from '#/web/state.ts'

defineProps<{
  day?: boolean
}>()

const hintText = computed(() => {
  if (!meta.value.hintLevel) return t('hint-level-none')
  else if (meta.value.hintLevel === 1) return t('hint-level-1')
  else return t('hint-level-2')
})
</script>

<template>
  <div class="whitespace-nowrap opacity-50 my-1 text-sm text-center">
    <template v-if="day"> {{ dayNoHanzi }} · </template>
    {{ hintText }} ·
    {{ formatDuration(meta.duration || 0) }}
  </div>
</template>
