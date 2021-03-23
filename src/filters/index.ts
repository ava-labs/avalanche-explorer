import moment from 'moment'
import Vue from 'vue'

Vue.filter('fromNow', function (time: string) {
    if (!time) return ''
    return moment(time).fromNow()
})
