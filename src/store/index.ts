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
        assetsLoaded: false,
        known_addresses: AddressDict,
        chainId: "X",
    },
    actions: {
        async init(store) {
            await api.get("/x/assets").then(res => {
                let assets = res.data.assets;
                assets.forEach((assetData: any) => {
                    store.commit("addAsset", new Asset(assetData));
                });
            });
            store.commit("finishLoading");
        }
    },
    mutations: {
        addAsset(state, asset) {
            Vue.set(state.assets, asset.id, asset);
        },
        finishLoading(state) {
            state.assetsLoaded = true;
        }
    },
    getters: {
        assetsArray(state: IRootState): Asset[] {
            let res: Asset[] = [];
            for (let i in state.assets) {
                res.push(state.assets[i]);
            }
            res.sort((a, b) => b.volume_day - a.volume_day);
            return res;
        },
        assetsArrayNonProfane(state: IRootState, getters): Asset[] {
            return getters.assetsArray.filter((val: Asset) => {
                return !val.profane;
            });
        },
        assetsArrayProfane(state: IRootState, getters) {
            return getters.assetsArray.filter((val: Asset) => {
                return val.profane;
            });
        }
    }
})
