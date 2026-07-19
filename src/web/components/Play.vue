<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { filterNonChineseChars } from '#/shared/tools/hanzi/filter.ts'
import { getPronunciations } from '#/web/api/pronunciations.ts'
import { cachePinyin } from '#/web/logic/pinyin.ts'
import { hasOpenModal, showCheatSheet, showFailed, showHint } from '#/web/modal-state.ts'
import { answer, isDev, isFailed, isFinished } from '#/web/state.ts'
import { markStart, meta, tries, useNoHint } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'
import { TRIES_LIMIT, WORD_LENGTH } from '#/shared/game-constants.ts'

const el = ref<HTMLInputElement>()
const input = ref('')
const inputValue = ref('')
const inputLength = computed(() => Array.from(input.value).length)

const isFinishedDelay = debouncedRef(isFinished, 800)
const validation = useMutation({
  mutationFn: async (word: string) => getPronunciations([word]),
})

async function enter() {
  if (inputLength.value !== WORD_LENGTH || validation.isPending.value) return
  const word = input.value
  const data = await validation.mutateAsync(word).catch(() => undefined)
  const pronunciation = data?.pronunciations[word]
  if (pronunciation) cachePinyin(word, pronunciation)
  tries.value.push(word)
  input.value = ''
  inputValue.value = ''
}
function reset() {
  tries.value = []
  meta.value = {}
  input.value = ''
  inputValue.value = ''
}
function handleInput(e: Event) {
  const el = e.target! as HTMLInputElement
  input.value = Array.from(filterNonChineseChars(el.value)).slice(0, WORD_LENGTH).join('')
  inputValue.value = input.value
  markStart()
}
function focus() {
  el.value?.focus()
}
function hint() {
  meta.value.hint = true
  if (!meta.value.hintLevel) meta.value.hintLevel = 1
  showHint.value = true
}
function sheet() {
  showCheatSheet.value = !showCheatSheet.value
}

onMounted(() => {
  if (!hasOpenModal.value) focus()
})

watch(hasOpenModal, async (open) => {
  if (open) return
  await nextTick()
  requestAnimationFrame(() => {
    if (document.activeElement === document.body) focus()
  })
})

watchEffect(() => {
  if (isFailed.value && !meta.value.failed) {
    meta.value.failed = true
    setTimeout(() => {
      showFailed.value = true
    }, 1200)
  }
})
</script>

<template>
  <div>
    <div class="play-board flex flex-col pt-4 items-center">
      <WordBlocks v-for="(w, i) of tries" :key="i" :word="w" :revealed="true" @click="focus()" />

      <template v-if="meta.answer">
        <div class="my-4">
          <div class="font-serif p-2">
            {{ t('correct-answer') }}
          </div>
          <WordBlocks :word="answer.word" />
        </div>
      </template>

      <WordBlocks v-if="!isFinished" :word="input" :active="true" @click="focus()" />

      <div class="mt-1" />

      <Transition name="fade-out">
        <div v-if="!isFinished" class="flex flex-col gap-2 items-center">
          <div class="guess-input relative border-2 border-base rounded-none">
            <input
              ref="el"
              v-model="inputValue"
              type="text"
              autocomplete="false"
              :placeholder="t('input-placeholder')"
              :disabled="isFinished || validation.isPending.value"
              @input="handleInput"
              @keydown.enter="enter"
              class="bg-transparent guess-input-field p-3 outline-none text-center"
            />
          </div>
          <button
            :disabled="inputLength !== WORD_LENGTH || validation.isPending.value"
            @click="enter"
            class="mt-3 btn px-6 py-2"
          >
            {{ t('ok-spaced') }}
          </button>
          <div v-if="tries.length > 4 && !isFailed" class="opacity-50">
            {{ t('tries-rest', TRIES_LIMIT - tries.length) }}
          </div>
          <button v-if="isFailed" @click="showFailed = true" class="square-btn">
            <div class="i-[mdi--emoticon-devil-outline]" />
            {{ t('view-answer') }}
          </button>

          <div
            :class="isFinished ? '!opacity-0 pointer-events-none' : ''"
            class="flex items-center justify-center mt-4"
          >
            <button
              v-if="!useNoHint"
              @click="hint()"
              class="mx-2 icon-btn text-[var(--c-text)] pb-2 gap-1 flex items-center justify-center"
            >
              <div class="i-[carbon--idea]" />
              {{ t('hint') }}
            </button>
            <button
              @click="sheet()"
              class="mx-2 icon-btn text-[var(--c-text)] pb-2 gap-1 flex items-center justify-center"
            >
              <div class="i-[carbon--grid]" />
              {{ t('cheatsheet') }}
            </button>
          </div>
        </div>
      </Transition>
      <Transition name="fade-in">
        <div v-if="isFinishedDelay && isFinished">
          <ResultFooter />
          <Countdown />
        </div>
      </Transition>

      <template v-if="isDev">
        <div class="h-[50rem]" />
        <div class="opacity-50 mb-2">测试用</div>
        <button @click="reset" class="btn">重置</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.guess-input {
  width: var(--game-board-width);
}

.guess-input-field {
  width: 100%;
}

@media (min-width: 768px) {
  .play-board {
    width: min(100%, 32rem);
    margin: 0 auto;
    padding-top: clamp(1rem, 2vw, 1.5rem);
  }
}
</style>
