import router from './router'
import { createApp } from 'vue'
import App from './App.vue'


window.addEventListener('auth:expired', () => {
  router.replace('/login')
})

const app = createApp(App)
app.use(router)
app.mount('#app')
