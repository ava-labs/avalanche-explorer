import Vue from 'vue';
import Vuetify from 'vuetify';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faSnowman, faSync, faInfoCircle, faBars, faTimes, faCheck, faCheckCircle, faExclamation, faCopy, faCog, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearch, faTwitter, faDiscord, faReddit, faSnowman, faClock, faSync, faInfoCircle, faBars, faTimes, faCheck, faCheckCircle, faExclamation, faCopy, faCog, faAngleDown);
Vue.component('fa', FontAwesomeIcon);

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {

            },
            dark: {
                nav_bar: "#fff",
                primary: "#4fb1d6",
            }
        }
    }
});
