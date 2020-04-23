import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import api from '../axios';
import {Asset} from "@/js/Asset";

import {RootState} from "@/store/types";

export default new Vuex.Store({
    state: {
        assets: {}
    },
    getters: {
        assetsArray(store: RootState){
            let res = [];
            for(let i in store.assets){
                res.push(store.assets[i]);
            }
            return res;
        }
    },
    mutations: {

    },
    actions: {
        init(store){

            api.get('/x/assets').then( res => {

                let data = res.data;

                data.forEach( (assetData: any) => {
                    let asset = new Asset(assetData);
                    // store.state.assets[asset.id] = asset;
                    Vue.set(store.state.assets,asset.id,asset);

                    console.log(asset);
                });
            })
        }
    },

    modules: {
    }
})
