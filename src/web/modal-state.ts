type ModalName = 'cheatSheet' | 'dashboard' | 'failed' | 'help' | 'hint' | 'settings' | 'share' | 'variants'

interface ModalEntry {
  name: ModalName
  returnFocus: HTMLElement | null
}

const modalStack = ref<ModalEntry[]>([])
const activeModal = computed(() => modalStack.value.at(-1)?.name)
export const hasOpenModal = computed(() => modalStack.value.length > 0)

function modalState(name: ModalName) {
  return computed({
    get: () => activeModal.value === name,
    set: (open: boolean) => {
      const entry = modalStack.value.find((item) => item.name === name)
      modalStack.value = modalStack.value.filter((item) => item.name !== name)

      if (open) {
        modalStack.value.push({
          name,
          returnFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null,
        })
      } else if (!modalStack.value.length && entry?.returnFocus?.isConnected) {
        requestAnimationFrame(() => entry.returnFocus?.focus())
      }
    },
  })
}

export const showHint = modalState('hint')
export const showSettings = modalState('settings')
export const showHelp = modalState('help')
export const showFailed = modalState('failed')
export const showDashboard = modalState('dashboard')
export const showVariants = modalState('variants')
export const showCheatSheet = modalState('cheatSheet')
export const showShareDialog = modalState('share')
