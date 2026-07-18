<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { filterNonChineseChars } from '#/shared/tools/hanzi/filter.ts'
import { validateIdioms } from '#/web/api/idioms.ts'
import { cachePinyin } from '#/web/logic/pinyin.ts'
import { hasOpenModal, showCheatSheet, showFailed, showHint } from '#/web/modal-state.ts'
import { answer, isDev, isFailed, isFinished } from '#/web/state.ts'
import { markStart, meta, tries, useNoHint, useStrictMode } from '#/web/storage.ts'
import { t } from '#/web/i18n.ts'
import { TRIES_LIMIT, WORD_LENGTH } from '#/shared/game-constants.ts'

const el = ref<HTMLInputElement>()
const input = ref('')
const inputValue = ref('')
const showToast = autoResetRef(false, 1000)
const shake = autoResetRef(false, 500)

const isFinishedDelay = debouncedRef(isFinished, 800)
const validation = useMutation({
  mutationFn: async (word: string) => validateIdioms([word]),
})

async function enter() {
  if (input.value.length !== WORD_LENGTH || validation.isPending.value) return
  const word = input.value
  const data = await validation.mutateAsync(word).catch(() => undefined)
  const pronunciation = data?.pronunciations[word]
  if (pronunciation) cachePinyin(word, pronunciation)
  const isValid = !useStrictMode.value || data?.validity[word] === true
  if (!isValid) {
    showToast.value = true
    shake.value = true
    return false
  }
  if (meta.value.strict == null) meta.value.strict = useStrictMode.value
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
  input.value = filterNonChineseChars(el.value).slice(0, 4)
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
    <div class="play-board" flex="~ col" pt4 items-center>
      <WordBlocks v-for="(w, i) of tries" :key="i" :word="w" :revealed="true" @click="focus()" />

      <template v-if="meta.answer">
        <div my4>
          <div font-serif p2>
            {{ t('correct-answer') }}
          </div>
          <WordBlocks :word="answer.word" />
        </div>
      </template>

      <WordBlocks v-if="!isFinished" :class="{ shake }" :word="input" :active="true" @click="focus()" />

      <div mt-1 />

      <Transition name="fade-out">
        <div v-if="!isFinished" flex="~ col gap-2" items-center>
          <div class="guess-input" relative border="2 base rounded-0">
            <input
              ref="el"
              v-model="inputValue"
              bg-transparent
              class="guess-input-field"
              w-86
              p3
              outline-none
              text-center
              type="text"
              autocomplete="false"
              :placeholder="t('input-placeholder')"
              :disabled="isFinished || validation.isPending.value"
              :class="{ shake }"
              @input="handleInput"
              @keydown.enter="enter"
            />
            <div
              absolute
              top-0
              left-0
              right-0
              bottom-0
              flex="~ center"
              bg-base
              transition-all
              duration-300
              text-mis
              pointer-events-none
              :aria-hidden="!showToast"
              :class="showToast ? '' : 'op0 translate-y--1'"
            >
              <span tracking-1 pl1>
                {{ t('invalid-idiom') }}
              </span>
            </div>
          </div>
          <button
            mt3
            btn
            p="x6 y2"
            :disabled="input.length !== WORD_LENGTH || validation.isPending.value"
            @click="enter"
          >
            {{ t('ok-spaced') }}
          </button>
          <div v-if="tries.length > 4 && !isFailed" op50>
            {{ t('tries-rest', TRIES_LIMIT - tries.length) }}
          </div>
          <button v-if="isFailed" square-btn @click="showFailed = true">
            <div i-mdi-emoticon-devil-outline />
            {{ t('view-answer') }}
          </button>

          <div flex="~ center" mt4 :class="isFinished ? 'op0! pointer-events-none' : ''">
            <button v-if="!useNoHint" mx2 icon-btn text-base pb2 gap-1 flex="~ center" @click="hint()">
              <div i-carbon-idea />
              {{ t('hint') }}
            </button>
            <button mx2 icon-btn text-base pb2 gap-1 flex="~ center" @click="sheet()">
              <div i-carbon-grid />
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
        <div h-200 />
        <div op50 mb-2>测试用</div>
        <button class="btn" @click="reset">重置</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .play-board {
    --game-width: clamp(21.5rem, calc(37.5vw + 1.5rem), 25.5rem);
    width: min(100%, 32rem);
    margin: 0 auto;
    padding-top: clamp(1rem, 2vw, 1.5rem);
  }

  .guess-input,
  .guess-input-field {
    width: var(--game-width) !important;
  }

  .guess-input-field {
    min-height: clamp(3rem, 5.47vw, 3.5rem);
  }
}
</style>
