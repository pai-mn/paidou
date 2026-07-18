<script setup lang="ts">
import '#/init.ts'
import { answer, dayNo, daySince, initializeAnswerQuery, isAnswerLoading, isDev } from '#/state.ts'
import { colorblind } from '#/storage.ts'
import { DAYS_PLAY_BACK } from '#shared/game-constants.ts'

const { height } = useWindowSize()
initializeAnswerQuery()

watchEffect(() => {
  document.documentElement.style.setProperty('--vh', `${height.value / 100}px`)
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-300" select-none :class="{ colorblind }">
    <NotTodayBanner v-if="dayNo < daySince" />
    <Navbar />
    <div p="4">
      <div v-if="isAnswerLoading" />
      <NoQuizToday v-else-if="!answer.word" />
      <NoFuturePlay v-else-if="dayNo > daySince && !isDev" />
      <NoPastPlay v-else-if="daySince - dayNo > DAYS_PLAY_BACK && !isDev" />
      <Play v-else />
    </div>
    <ModalsLayer />
    <Confetti />
  </main>
</template>
