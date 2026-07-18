// register vue composition api globally
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '#/web/App.vue'
import { queryClient } from '#/web/api/query-client.ts'

import '#/web/styles/main.css'

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
