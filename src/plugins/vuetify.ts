import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { zhHans } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'zhHans',
    messages: { zhHans }
  },
  icons: {
    defaultSet: 'mdi', // 设置默认图标库为 Material Design Icons
    aliases: {
      ...aliases,
      prev: 'mdi-chevron-left',
      next: 'mdi-chevron-right',
    },
    sets: {
      mdi,
    },
  },
})
