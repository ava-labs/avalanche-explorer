import moment from 'moment'
import Vue from 'vue'

Vue.filter('fromNow', function (time: string) {
    if (!time) return ''
    return moment(time).fromNow()
})

Vue.filter('pluralize', function (val: number, unit: string) {
    return val === 0
        ? `${val} ${unit}s`
        : val > 1
        ? `${val} ${unit}s`
        : `${val} ${unit}`
})
