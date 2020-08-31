import Vue from "vue"
import Vuex from "vuex"
import api from "../axios";
import { Asset } from "@/js/Asset";
import { IRootState } from "@/store/types";
import AddressDict from "@/known_addresses";
import Platform from "./modules/platform/platform";
import Address from "./modules/address/address";
import { avm } from '@/avalanche';
import { IAssetData } from '@/js/IAsset';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Platform,
        Address
    },
    state: {
        assets: {},
        assetsLoaded: false,
        known_addresses: AddressDict,
        chainId: "X",
    },
    actions: {
        async init(store) {
            // TODO: support service for multiple chain
            let start = -1;
            let offset = 0;
            const limit = 500;
            let res = await api.get(`/x/assets?&offset=${offset}&limit=${limit}`);
            let assets = res.data.assets;
            assets.forEach((assetData: any) => {
                store.commit("addAsset", new Asset(assetData, false));
            });

            async function checkForMoreAssets() {
                if (assets.length === limit) {
                    start = start + limit // -1 + 499
                    offset = start
                    let res = await api.get(`/x/assets?&offset=${offset}&limit=${limit}`);
                    let assets = res.data.assets;
                    assets.forEach((assetData: any) => {
                        store.commit("addAsset", new Asset(assetData, false));
                    });
                }
            }

            await checkForMoreAssets();
            store.commit("finishLoading");
        },

        // Adds an unknown asset id to the assets dictionary
        async addUnknownAsset({commit}, assetId:string) {
            let desc = await avm.getAssetDescription(assetId);
            let newAssetData: IAssetData = {
                alias: "",
                chainID: "rrEWX7gc7D9mwcdrdBxBTdqh1a7WDVsMuadhTZgyXfFcRz45L",
                currentSupply: 0,
                denomination: desc.denomination,
                id: assetId,
                name: desc.name,
                symbol: desc.symbol
            };
            commit("addAsset", new Asset(newAssetData, true));
        },
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
            res.sort((a, b) => {
                let diff = b.volume_day.minus(a.volume_day);
                if (diff.gt(0)) return -1;
                else if (diff.lt(0)) return 1;
                else return 0;
            });
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
        },
        totalTransactions(state: IRootState): number {
            let totalTransactions = 0;
            for (let asset in state.assets) {
                totalTransactions += state.assets[asset].txCount_day;
            }
            return totalTransactions;
        }
    }
})
