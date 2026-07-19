<script setup lang="ts">
import { t } from '#/web/i18n.ts'
</script>

<template>
  <div class="p-5 flex flex-col items-center justify-center variant-links">
    <p class="text-xl font-serif mb-4">
      <b>{{ t('other-variants') }}</b>
    </p>
    <ul class="flex flex-col gap-3 text-left w-50 m-2 list-disc">
      <li><a href="https://handle.antfu.me/" target="_blank">汉兜 Handle</a> - by Anthony Fu</li>
      <li><a href="https://pinyincaichengyu.com" target="_blank">拼音猜成语</a> - by limboy</li>
      <li><a href="https://cheeaun.github.io/chengyu-wordle/" target="_blank">成语 Wordle</a> - by Chee Aun</li>
      <li><a href="https://apps.apple.com/cn/app/id1606194420" target="_blank">猜文字 (iOS)</a> - by Jinke Du</li>
    </ul>
  </div>
</template>

<style scoped>
.variant-links a {
  color: var(--c-primary);
}
.variant-links a:hover {
  color: var(--c-primary-deep);
}
</style>
