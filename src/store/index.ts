import Vue from "vue"
import Vuex from "vuex"
import api from "../axios";
import { Asset } from "@/js/Asset";
import { IRootState } from "@/store/types";
import AddressDict from "@/known_addresses";
import Platform from "./modules/platform/platform";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Platform
    },
    state: {
        assets: {},
        known_addresses: AddressDict,
        chainId: "X",
    },
    getters: {
        assetsArray(state: IRootState) {
            let res = [];
            for (let i in state.assets) {
                res.push(state.assets[i]);
            }
            return res;
        }
    },
    mutations: {},
    actions: {
        init(store) {
            console.log(AddressDict);
            api.get("/x/assets").then(res => {
                let assets = res.data.assets;
                assets.forEach((assetData: any) => {
                    let asset = new Asset(assetData);
                    Vue.set(store.state.assets, asset.id, asset);
                });
            })
        }
    },
})
