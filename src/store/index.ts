import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import api from '../axios';


export default new Vuex.Store({
  state: {
    recent_tx: [
      {
        id: 0,
        from: "0x2378194792837123",
        to: "0xF01238o9asdf4",
        time: 926664348572
      },
      {
        id: 1,
        from: "0x2378194792837123",
        to: "0xF01238o9asdf4",
        time: 926664348572
      },
      {
        id: 2,
        from: "0x2378194792837123",
        to: "0xF01238o9asdf4",
        time: 926664348572
      }
    ],
  },
  mutations: {
  },
  actions: {
    getRecentTx(){
      api.get('/transactions/recent').then((res) => {
        console.log(res);
      });
    }
  },
  modules: {
  }
})
