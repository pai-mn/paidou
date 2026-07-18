// register vue composition api globally
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '#/App.vue'
import { queryClient } from '#/api/query-client.ts'

import '@unocss/reset/tailwind.css'
import '#/styles/main.css'
import 'uno.css'

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
