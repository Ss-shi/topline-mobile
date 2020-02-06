import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/register-vant.js'
import 'amfe-flexible'
import '@/utils/validation'
import '@/styles/index.less'
import './utils/datetime'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
