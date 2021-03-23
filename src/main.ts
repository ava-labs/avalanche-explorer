import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Big from 'big.js'
import VueAnalytics from 'vue-analytics'
import './filters'
//@ts-ignore
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
    id: 'UA-126268251-7',
    router,
})

Vue.component('datetime', Datetime)

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

// Extending Big.js with a helper function
Big.prototype.toLocaleString = function (toFixed = 2) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
