import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Big from 'big.js'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
    id: 'UA-126268251-7',
    router,
})

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')

declare module 'big.js' {
    interface Big {
        toLocaleString(toFixed: number): string
    }
}

Big.prototype.toLocaleString = function (toFixed = 2) {
    const value = this
    const remainder = value.mod(1)
    const wholeNums = value.minus(remainder)
    const wnInt = parseInt(wholeNums.toFixed(0))

    if (toFixed === 0) return wnInt.toLocaleString()

    return parseFloat(remainder) === 0
        ? wnInt.toLocaleString()
        : wnInt.toLocaleString() +
              '.' +
              remainder.toFixed(toFixed).split('.')[1].toString()
}
