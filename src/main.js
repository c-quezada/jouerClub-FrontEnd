// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueSession from 'vue-session'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'


Vue.use(Vuetify, {
  theme: {
    primary: "#26A69A", secondary: "#00897B", accent: "#64FFDA", error: "#FF1744", warning: "#F9A825", info: "#00B0FF", success: "#00E676"
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
