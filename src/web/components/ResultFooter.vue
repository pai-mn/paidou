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
  <div op50 my1 text-sm ws-nowrap text-center>
    <template v-if="day"> {{ dayNoHanzi }} · </template>
    {{ hintText }} ·
    <template v-if="meta.strict"> {{ t('strict-mode') }} · </template>
    {{ formatDuration(meta.duration || 0) }}
  </div>
</template>
