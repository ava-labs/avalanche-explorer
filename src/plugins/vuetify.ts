import Vue from 'vue'
import Vuetify from 'vuetify'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faBars,
    faCheck,
    faCheckCircle,
    faCog,
    faCopy,
    faExclamation,
    faInfoCircle,
    faSearch,
    faSnowman,
    faSync,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'

import { faClock } from '@fortawesome/free-regular-svg-icons'
import {
    faTwitter,
    faDiscord,
    faReddit,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faBars,
    faCheck,
    faCheckCircle,
    faClock,
    faCog,
    faCopy,
    faDiscord,
    faExclamation,
    faInfoCircle,
    faReddit,
    faSearch,
    faSnowman,
    faSync,
    faTimes,
    faTwitter
)
Vue.component('fa', FontAwesomeIcon)

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {},
            dark: {
                nav_bar: '#fff',
                primary: '#4fb1d6',
            },
        },
    },
})
