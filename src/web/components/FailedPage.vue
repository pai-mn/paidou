<script setup lang="ts">
import { showFailed } from '#/web/modal-state.ts'
import { meta } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'

function revealAnswer() {
  showFailed.value = false
  meta.value.answer = true
  meta.value.failed = true
}
</script>

<template>
  <div class="p-5 flex flex-col items-center justify-center">
    <div class="i-[carbon--face-dizzy] text-5xl opacity-50 m-4" />
    <div>
      {{ t('failed-1') }}<br /><br />
      {{ t('failed-2') }}<br />
      {{ t('failed-3') }}
    </div>
    <div class="p-4 flex gap-5 items-center justify-center">
      <button @click="showFailed = false" class="btn">
        {{ t('continue') }}
      </button>
      <button
        @click="revealAnswer()"
        class="icon-btn inline gap-1 items-center justify-center text-[var(--c-text)] !text-mis"
      >
        <div class="i-[mdi--emoticon-devil-outline]" />
        {{ t('view-answer') }}
      </button>
    </div>
  </div>
</template>
