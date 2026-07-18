<script setup lang="ts">
import '#/web/init.ts'
import { answer, dayNo, initializeAnswerQuery, isAnswerLoading } from '#/web/state.ts'
import { colorblind } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'

const { height } = useWindowSize()
const gameQuery = initializeAnswerQuery()
const isAnswerError = gameQuery.isError

watchEffect(() => {
  document.documentElement.style.setProperty('--vh', `${height.value / 100}px`)
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-300" select-none :class="{ colorblind }">
    <Navbar />
    <div class="game-stage" p="4">
      <div v-if="isAnswerLoading" />
      <div v-else-if="isAnswerError" flex="~ col gap-4" items-center py12>
        <div>{{ t('game-load-error') }}</div>
        <button btn @click="gameQuery.refetch()">{{ t('retry') }}</button>
      </div>
      <NoQuizToday v-else-if="!answer.word" />
      <Play v-else :key="dayNo" />
    </div>
    <ModalsLayer />
    <Confetti />
  </main>
</template>

<style scoped>
@media (min-width: 768px) {
  .game-stage {
    width: min(100%, 48rem);
    margin: 0 auto;
    padding-top: clamp(1rem, 3vw, 2rem);
  }
}
</style>
