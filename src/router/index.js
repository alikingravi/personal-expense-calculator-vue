import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home.vue'
import Monthly from '@/components/pages/month/Monthly.vue'
import Yearly from '@/components/pages/year/Yearly.vue'


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/monthly-data/:year/:month',
            name: 'Monthly',
            component: Monthly
        },
        {
            path: '/yearly-data/:year',
            name: 'Yearly',
            component: Yearly
      }
    ]
})
