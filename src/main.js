// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Header from './components/global/Header.vue'
import Home from './components/pages/Home.vue'
import HighCharts from 'vue-highcharts'

Vue.config.productionTip = false
Vue.use(axios)
Vue.use(HighCharts)

// Componenets
Vue.component('app-header', Header)
Vue.component('app-home', Home)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
