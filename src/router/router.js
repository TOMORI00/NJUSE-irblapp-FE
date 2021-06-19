import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import homepage from "../view/homepage"
import Authentication from "../view/Authentication"
export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/Authentication'
        },
        {
            path: '/Authentication',
            component: Authentication
        },
        {
            path: '/homepage',
            component: homepage
        }
    ]
})