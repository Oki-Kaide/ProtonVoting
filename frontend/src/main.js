import { createApp } from 'vue'
import { store } from './store'
import { router } from './router'

import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')
