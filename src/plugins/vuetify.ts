import Vue from 'vue';
import Vuetify from 'vuetify';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearch);
Vue.component('fa', FontAwesomeIcon);


Vue.use(Vuetify);

export default new Vuetify({
});
