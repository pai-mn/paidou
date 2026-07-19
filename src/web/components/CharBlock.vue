<script setup lang="ts">
import type { MatchResult, MatchType, ParsedChar } from '#/web/logic/types.ts'
import { inputMode, useCheckAssist } from '#/web/storage.ts'
import { getSymbolState, useMask, useNumberTone } from '#/web/state.ts'

const props = defineProps<{
  char?: ParsedChar
  answer?: MatchResult
  active?: boolean
}>()

const exact = computed(() => props.answer && Object.values(props.answer).every((i) => i === 'exact'))

const parsed = computed(() => {
  if (props.answer) return props.answer
  if (!props.char || !useCheckAssist.value || !props.active) return

  // Assist coloring
  return {
    _1: getSymbolState(props.char._1, inputMode.value === 'sp' ? '_1' : undefined) === 'none' ? 'deleted' : undefined,
    _2: getSymbolState(props.char._2, inputMode.value === 'sp' ? '_2' : undefined) === 'none' ? 'deleted' : undefined,
    _3: getSymbolState(props.char._3) === 'none' ? 'deleted' : undefined,
    tone: getSymbolState(props.char.tone, 'tone') === 'none' ? 'deleted' : undefined,
  } as MatchResult
})

function getColor(result?: MatchType, isChar = false) {
  const pre = useMask.value ? `bg-current ${isChar ? ' !opacity-70' : '!opacity-40'} border border-current` : ''

  if (!result || exact.value) return pre

  const colors = {
    exact: 'text-ok',
    misplaced: 'text-mis',
    none: isChar ? 'opacity-80' : 'opacity-35',
    deleted: inputMode.value === 'zy' ? 'opacity-30' : 'line-through opacity-30',
  }
  return `${pre} ${colors[result]}`
}

const blockColor = computed(() => {
  if (!props.answer) return 'border-base'
  if (exact.value) return 'border-transparent bg-ok text-white'
  return 'border-transparent bg-muted'
})

const toneCharLocation = computed(() => {
  const part = props.char?._2 || ''
  return (
    [
      part.lastIndexOf('iu') > -1 ? part.lastIndexOf('iu') + 1 : -1,
      part.lastIndexOf('a'),
      part.lastIndexOf('e'),
      part.lastIndexOf('o'),
      part.lastIndexOf('i'),
      part.lastIndexOf('u'),
      part.lastIndexOf('v'),
    ].find((i) => i !== null && i >= 0) || 0
  )
})

const vLocation = computed(() => {
  const part = props.char?._2 || ''
  return part.lastIndexOf('v')
})

const partTwo = computed(() => {
  const two = props.char?._2 || ''
  const index = toneCharLocation.value
  // replace i with dot less for tone symbol
  if (!useNumberTone.value && two[index] === 'i') return `${two.slice(0, index)}ı${two.slice(index + 1)}`
  return two
})
</script>

<template>
  <div
    :class="blockColor"
    class="char-block border-2 flex items-center justify-center relative leading-[1em] font-serif"
  >
    <template v-if="char?.char?.trim()">
      <!-- Zhuyin -->
      <template v-if="inputMode === 'zy'">
        <div
          :class="[getColor(parsed?.char, true), useMask ? 'left-3' : 'left-4']"
          class="absolute text-3xl leading-[1em] flex items-center text-center top-0 bottom-0"
        >
          {{ char.char }}
        </div>
        <div class="absolute flex items-center text-center top-0 bottom-0 right-[2.5rem] w-5">
          <div style="writing-mode: vertical-rl" class="flex items-center justify-center text-xs">
            <span v-if="char._1" :class="getColor(parsed?._1)">
              {{ char._1 }}
            </span>
            <span v-if="char._2" :class="getColor(parsed?._2)">
              {{ char._2 }}
            </span>
            <span v-if="char._3" :class="getColor(parsed?._3)">
              {{ char._3 }}
            </span>
          </div>
          <ToneSymbol :tone="char.tone" :class="getColor(parsed?.tone)" class="mt-[-0.25rem] min-w-[6px]" />
        </div>
      </template>

      <!-- Pinyin or Shuangpin -->
      <template v-else>
        <div
          :class="[getColor(parsed?.char, true), useMask ? 'top-[2.125rem]' : 'top-8']"
          class="absolute text-3xl leading-[1em]"
        >
          {{ char.char }}
        </div>
        <div
          :class="[useMask ? 'top-[14px]' : 'top-[11px]']"
          class="absolute font-mono text-center left-0 right-0 font-normal flex flex-col items-center"
        >
          <div class="relative m-auto items-start flex justify-center">
            <div v-if="char._1" :class="getColor(parsed?._1)" class="mx-1px">
              {{ char._1 }}
            </div>
            <div v-if="partTwo" class="mx-1px flex">
              <div v-for="(w, idx) of partTwo" :key="idx" class="relative">
                <div :class="getColor(parsed?._2)">
                  {{ inputMode === 'sp' ? w : w.replace('v', 'u') }}
                </div>
                <VDots
                  v-if="!useMask && idx === vLocation && inputMode === 'py'"
                  :class="getColor(parsed?._2)"
                  class="absolute w-[87%] left-[8%] bottom-[0.76rem]"
                />
                <ToneSymbol
                  v-if="!useNumberTone && idx === toneCharLocation"
                  :tone="char.tone"
                  :class="getColor(parsed?.tone)"
                  :style="{
                    bottom: useMask ? '1.25rem' : w === 'v' ? '0.85rem' : '0.78rem',
                  }"
                  class="absolute w-[86%] left-[8%]"
                />
              </div>
            </div>
            <div
              v-if="useNumberTone"
              :class="getColor(parsed?.tone)"
              class="text-xs leading-[1em] mr-[-0.75rem] mt-[-0.25rem] ml-1px"
            >
              {{ char.tone }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.char-block {
  width: var(--game-tile-size);
  height: var(--game-tile-size);
}
</style>
