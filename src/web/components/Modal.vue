<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, VisuallyHidden } from 'reka-ui'

defineProps<{
  label: string
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <DialogRoot :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogPortal>
      <DialogOverlay class="modal-mask bg-base fixed inset-0 z-40 opacity-50" />
      <DialogContent
        :aria-describedby="undefined"
        class="modal-panel bg-base border-base fixed z-40 overflow-auto scrolls"
        @close-auto-focus="$event.preventDefault()"
      >
        <VisuallyHidden>
          <DialogTitle>{{ label }}</DialogTitle>
        </VisuallyHidden>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.modal-panel {
  --modal-gutter: clamp(0rem, calc(4vw - 1rem), 2rem);
  --modal-top: clamp(0rem, calc(9vw - 2.2rem), 4.5rem);
  top: var(--modal-top);
  left: 50%;
  width: min(calc(100% - var(--modal-gutter) * 2), 46rem);
  max-height: calc(var(--vh, 1vh) * 100 - var(--modal-top) - var(--modal-gutter));
  border-bottom: 1px solid rgba(156, 163, 175, 0.2);
  transform: translateX(-50%);
}

.modal-mask[data-state='open'] {
  animation: modal-mask-in 0.2s ease-out;
}

.modal-panel[data-state='open'] {
  animation: modal-panel-in 0.2s ease-out;
}

@keyframes modal-mask-in {
  from {
    opacity: 0;
  }
}

@keyframes modal-panel-in {
  from {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
}

@media (min-width: 768px) {
  .modal-panel {
    border: 1px solid rgba(156, 163, 175, 0.2);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
  }
}
</style>
