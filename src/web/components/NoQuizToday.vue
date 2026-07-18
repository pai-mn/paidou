<script setup lang="ts">
import { t } from '#/web/i18n.ts'
</script>

<template>
  <div>
    <p class="text-center p-4">
      {{ t('no-quiz-today') }}
    </p>
    <a href="/" class="btn">{{ t('back-today') }}</a>
  </div>
</template>
