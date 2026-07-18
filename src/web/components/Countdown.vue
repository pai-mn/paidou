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
  <div pt12 pb16>
    <div flex="~ col" items-center>
      <ShareButton m4 />
      <ToggleMask :hint="true" />
    </div>

    <div h-1px w-10 border="t base" mt4 mb6 mxa />

    <div flex="~ col center" relative>
      <div op50 ws-nowrap>
        {{ t('next-note') }}
      </div>
      <div text-lg ws-nowrap style="font-variant-numeric: tabular-nums">
        {{ formatted }}
      </div>
    </div>
  </div>
</template>
