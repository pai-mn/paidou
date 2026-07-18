<script setup lang="ts">
import DashboardItem from '#/web/components/DashboardItem.vue'
import { t } from '#/web/i18n.ts'
import { showDashboard } from '#/web/modal-state.ts'
import {
  averageDurations,
  gamesCount,
  history,
  historyTriesCount,
  noHintPassedCount,
  passedCount,
  passedTries,
} from '#/web/storage.ts'

const triesMap = computed(() => {
  const map = new Map<number, number>()
  passedTries.value.forEach((i) => {
    let count = i.tries!.length
    if (count > 10) count = 10
    map.set(count, (map.get(count) || 0) + 1)
  })
  return map
})

const triesMax = computed(() => {
  let max = 0
  Array.from(triesMap.value.keys()).forEach((i) => {
    if (i > max) max = i
  })
  return max
})

const tiresMaxCount = computed(() => {
  let max = 1
  Array.from(triesMap.value.values()).forEach((i) => {
    if (i > max) max = i
  })
  return max
})

function close() {
  showDashboard.value = false
}

const allWords = computed(() =>
  Array.from(
    new Set(
      Object.values(history.value)
        .flatMap((i) => i.tries)
        .filter(Boolean) as string[],
    ),
  ),
)
</script>

<template>
  <div class="p-5 flex flex-col items-center justify-center relative">
    <div class="absolute top-4 right-4 flex gap-3">
      <button @click="close" class="icon-btn">
        <div class="i-[carbon--close]" />
      </button>
    </div>

    <p class="text-xl font-serif mb-2">
      <b>{{ t('dashboard') }}</b>
    </p>
    <div v-if="passedTries.length >= 3 && triesMax" class="w-full max-w-[25rem] bg-subtle p-4 my-4">
      <p class="text-lg font-serif mb-2 mt-[-0.25rem] text-center tracking-widest">
        {{ t('guess-dist') }}
      </p>
      <div v-for="i of triesMax" :key="i" class="flex items-center gap-2">
        <div class="w-4 flex-none text-right opacity-50">
          {{ i === 10 ? '10+' : i }}
        </div>
        <div
          :style="{ width: triesMap.get(i) ? `${(triesMap.get(i)! / tiresMaxCount) * 100}%` : '1%' }"
          class="bg-primary h-5 text-white text-right flex justify-end"
        >
          <div class="text-sm my-auto mr-1">
            {{ triesMap.get(i) }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-[100px] py-2">
      <DashboardItem :value="gamesCount" :text="t('games-count')" />
      <DashboardItem :value="passedCount" :text="t('win-count')" />
      <DashboardItem :value="noHintPassedCount" :text="t('win-no-hint-count')" />
      <DashboardItem
        :value="`${gamesCount ? Math.round((passedCount / gamesCount) * 100) : 0}%`"
        :text="t('win-rate')"
      />
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-[100px] py-2">
      <DashboardItem :value="allWords.length" :text="t('used-words')" />
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-[100px] py-2">
      <DashboardItem
        :value="gamesCount ? (historyTriesCount / gamesCount).toFixed(1) : '-'"
        :text="t('average-tries-count')"
      />
      <DashboardItem :value="averageDurations || '-'" :text="t('average-durations')" />
    </div>
  </div>
</template>
