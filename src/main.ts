import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Big from 'big.js';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');

declare module "big.js" {
  interface Big {
    toLocaleString(toFixed: number): string;
  }
}

Big.prototype.toLocaleString = function(toFixed: number = 2) {
  let value = this;
  let remainder = value.mod(1);
  let wholeNums = value.minus(remainder);
  let wnInt = parseInt(wholeNums.toFixed(0));
  let result = wnInt.toLocaleString() + "." + remainder.toFixed(toFixed).split(".")[1].toString();
  return result;
}
