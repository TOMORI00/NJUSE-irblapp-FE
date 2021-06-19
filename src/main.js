import Vue from 'vue'
import App from './App.vue'
import router from "./router/router"
import http from './http'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.use(Antd)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
