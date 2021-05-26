import { blockchainMap, subnetMap } from '@/helper'
import { Asset } from '@/js/Asset'
import moment from 'moment'
import Vue from 'vue'

// Maps

Vue.filter('blockchain', function (val: string) {
    return blockchainMap(val)
})

Vue.filter('subnet', function (val: string) {
    return subnetMap(val)
})

Vue.filter('nameOrID', function (val: Asset) {
    return val.name ? val.name : val.id
})

// Date and Time

Vue.filter('date', function (time: number) {
    return moment(time).format('M/D/YYYY')
})

Vue.filter('time', function (val: number) {
    return moment(val).format('h:mm:ss A')
})

Vue.filter('duration', function (val: number) {
    return moment.duration(val).humanize()
})

Vue.filter('fromNow', function (time: string | number) {
    if (!time) return ''
    return moment(time).fromNow()
})

Vue.filter('toNow', function (time: string) {
    if (!time) return ''
    return moment(time).toNow()
})

// Pluralize

Vue.filter('pluralize', function (val: number | string, unit: string) {
    const num = typeof val === 'string' ? parseInt(val) : val
    return num === 0
        ? `${num} ${unit}s`
        : num > 1
        ? `${num} ${unit}s`
        : `${num} ${unit}`
})

Vue.filter('pluralizeDenomination', function (val: number) {
    return val === 0
        ? `no fractional units`
        : val > 1
        ? `${val} decimal digits`
        : `${val} decimal digit`
})

Vue.filter('pluralizeThreshold', function (val: number) {
    return val === 0
        ? `${val} threshold signatures from addresses are`
        : val > 1
        ? `${val} threshold signatures from addresses are`
        : `${val} threshold signature from address is`
})

Vue.filter(
    'pluralizeWithoutCount',
    function (val: number | string, unit: string): string {
        const num = typeof val === 'string' ? parseInt(val) : val
        return num === 0 ? `${unit}s` : num > 1 ? `${unit}s` : `${unit}`
    }
)

// UTXOs

Vue.filter('qualifyInput', function (unit: string, type: string): string {
    switch (type) {
        // X <- shared
        case 'import':
            return 'Imported ' + unit
        // P <- shared
        case 'pvm_import':
            return 'Imported ' + unit
        // C <- shared
        case 'atomic_import_tx':
            return 'Imported ' + unit
        default:
            return unit
    }
})

Vue.filter('qualifyOutput', function (unit: string, type: string): string {
    switch (type) {
        // X -> shared
        case 'export':
            return 'Exported ' + unit
        // P -> shared
        case 'pvm_export':
            return 'Exported ' + unit
        // C -> shared
        case 'atomic_export_tx':
            return 'Exported ' + unit
        default:
            return unit
    }
})
