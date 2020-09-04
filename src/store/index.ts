import Vue from "vue"
import Vuex from "vuex"
import api from "../axios";
import { Asset } from "@/js/Asset";
import { IRootState } from "@/store/types";
import AddressDict from "@/known_addresses";
import AssetDict from '@/known_assets';
import Platform from "./modules/platform/platform";
import Address from "./modules/address/address";
import Notifications from "./modules/notifications/notifications";
import { avm } from '@/avalanche';
import { IAssetData_Ortelius, IAssetData_Avalanche_Go } from '@/js/IAsset';
import { X_CHAIN_ID } from  '@/store/modules/platform/platform';
import { ITransaction } from '@/js/ITransaction';

Vue.use(Vuex);

export const AVAX_ID = AssetDict["AVAX"] as string;

export default new Vuex.Store({
    modules: {
        Platform,
        Address,
        Notifications
    },
    state: {
        assets: {},
        assetsLoaded: false,
        assetAggregatesLoaded: false,
        known_addresses: AddressDict,
        chainId: "X",
        recentTransactions: [] as ITransaction[]
    },
    actions: {
        async init(store) {
            // TODO: support service for multiple chain
            // Get list of all indexed assets
            let count = 0;
            let offset = 0;     
            const limit = 500;
            let res = await api.get(`/x/assets?offset=${offset}&limit=${limit}`);
            let assetsData = res.data.assets;
            count = res.data.count;             // count of indexed assets
            
            // keep getting asset data as necessary
            async function checkForMoreAssets() {
                offset += limit;
                let res = await api.get(`/x/assets?offset=${offset}&limit=${limit}`);
                let moreAssets = res.data.assets;
                assetsData.push(...moreAssets);
            }

            while (offset < count) {
                await checkForMoreAssets();
            }
            
            // once we get all the assets, instantiate assets and save them to the store
            assetsData.forEach((assetData: any) => {
                store.commit("addAsset", new Asset(assetData, false));
            });
            store.commit("finishLoading");

            // once we have assets, next get recent transactions
            store.dispatch("getRecentTransactions");
            
            // get asset aggregate data
            store.commit("updateAssetsWithAggregateData");
        },

        async getRecentTransactions(store) {
            // Get recent transactions
            let txNum = 10;
            let txRes = await api.get(`/x/transactions?sort=timestamp-desc&limit=${txNum}`);
            store.commit("addRecentTransactions", txRes.data.transactions);
        },

        // Adds an unknown asset id to the assets dictionary
        async addUnknownAsset({commit}, assetId:string) {
            let desc: IAssetData_Avalanche_Go = await avm.getAssetDescription(assetId);
            let newAssetData: IAssetData_Ortelius = {
                alias: "",
                chainID: X_CHAIN_ID,
                currentSupply: "0",
                denomination: desc.denomination,
                id: assetId,
                name: desc.name,
                symbol: desc.symbol
            };
            commit("addAsset", new Asset(newAssetData, true));
        },
        
        // dispatched from Asset instance upon /aggregates response
        checkAssetAggregatesLoaded(store) {
            let assetsArray = store.getters["assetsArray"];
            let notLoaded = assetsArray.find((element: Asset) => element.isHistoryUpdated === false);
            if (!notLoaded) {
                store.commit("finishAggregatesLoading");
                console.log("ALL ASSET AGGREGATES LOADED")
            }
        }

        // TODO - move cache here
    },
    mutations: {
        addAsset(state, asset) {
            Vue.set(state.assets, asset.id, asset);
        },
        finishLoading(state) {
            state.assetsLoaded = true;
        },
        finishAggregatesLoading(state) {
            state.assetAggregatesLoaded = true;
        },
        addRecentTransactions(state, transactions: ITransaction[]) {
            state.recentTransactions = transactions;
        },
        updateAssetsWithAggregateData(state) {
            for (const assetID in state.assets) {
                //@ts-ignore
                state.assets[assetID].updateVolumeHistory();
            }
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
