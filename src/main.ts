import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

createApp(App).use(router).use(createPinia()).use(ElementPlus, {
  locale: zhCn,
}).use(vuetify).mount('#app')
