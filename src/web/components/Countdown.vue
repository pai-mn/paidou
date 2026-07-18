<script setup lang="ts">
import { nextGameAt, now, serverClockOffset } from '#/web/state.ts'
import { t } from '#/web/i18n.ts'
const ms = computed(() => Math.max(0, new Date(nextGameAt.value).getTime() - (+now.value + serverClockOffset.value)))
const formatted = computed(() => {
  const h = Math.floor((ms.value % 86400000) / 3600000)
  const m = Math.floor((ms.value % 3600000) / 60000)
  const s = Math.floor((ms.value % 60000) / 1000)
  return t('time-format', h, m.toString().padStart(2, '0'), s.toString().padStart(2, '0'))
})
</script>

<template>
  <div class="pt-12 pb-16">
    <div class="flex flex-col items-center">
      <ShareButton class="m-4" />
      <ToggleMask :hint="true" />
    </div>

    <div class="h-px w-10 border-t border-base mt-4 mb-6 mx-auto" />

    <div class="flex flex-col items-center justify-center relative">
      <div class="whitespace-nowrap opacity-50">
        {{ t('next-note') }}
      </div>
      <div style="font-variant-numeric: tabular-nums" class="whitespace-nowrap text-lg">
        {{ formatted }}
      </div>
    </div>
  </div>
</template>
