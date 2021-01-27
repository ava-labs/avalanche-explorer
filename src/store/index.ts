import Vue from 'vue'
import Vuex from 'vuex'
import api from '../axios'
import { Asset } from '@/js/Asset'
import { IRootState } from '@/store/types'
import AddressDict from '@/known_addresses'
import AssetDict from '@/known_assets'
import Platform from './modules/platform/platform'
import Address from './modules/address/address'
import Network from './modules/network/network'
import Notifications from './modules/notifications/notifications'
import { avm } from '@/avalanche'
import {
    IAssetDataOrtelius,
    IAssetDataAvalancheGo,
    ICollisionMap,
} from '@/js/IAsset'
import { X_CHAIN_ID } from '@/store/modules/platform/platform'
import { ITransaction, ITransactionData } from '@/js/ITransaction'
import { getTransaction } from '@/services/transactions'

Vue.use(Vuex)

export const AVAX_ID = AssetDict['AVAX'] as string

export default new Vuex.Store({
    modules: {
        Platform,
        Address,
        Notifications,
        Network,
    },
    state: {
        assets: {},
        assetsLoaded: false,
        assetAggregatesLoaded: false,
        known_addresses: AddressDict,
        chainId: 'X',
        recentTransactions: [] as ITransaction[],
        assetsSubsetForAggregations: {}, // TODO: remove eventually
        // this is a bandaid until the API precomputes aggregate data for assets
        // it holds a subset of the assets and checks if they have aggregation data
        // temporarily responsible for triggering assetAggregatesLoaded
        collisionMap: {},
    } as IRootState,
    actions: {
        async init(store) {
            /* ==========================================
                Get and set initial list of all indexed assets
               ========================================== */
            // TODO: support service for multiple chains
            let isFinished = false
            let offset = 0
            const limit = 500
            const res = await api.get(
                `/x/assets?offset=${offset}&limit=${limit}`
            )
            const assetsData = res.data.assets

            // keep getting asset data as necessary
            async function checkForMoreAssets() {
                offset += limit
                const res = await api.get(
                    `/x/assets?offset=${offset}&limit=${limit}`
                )
                const moreAssets = res.data.assets
                if (moreAssets.length === 0) {
                    isFinished = true
                }
                assetsData.push(...moreAssets)
            }

            while (isFinished === false) {
                await checkForMoreAssets()
            }

            // once we get all the data, instantiate assets and save them to the store
            assetsData.forEach((assetData: any) => {
                store.commit('addAsset', new Asset(assetData, false))
            })
            store.commit('finishLoading')

            /* ==========================================
                Once we have assets, next get recent transactions
               ========================================== */
            store.dispatch('getRecentTransactions', 10)

            /* ==========================================
                Then get asset aggregation data for assets appearing in recent Txs
               ========================================== */
            // TODO: top assets in background thread
            store.dispatch('setAggregatesForAssetsInRecentTransactions')

            // DISABLED: get aggregate data for all assets
            // store.commit("updateAssetsWithAggregateData");

            /* ==========================================
                Uniqueify Symbols
               ========================================== */
            const collisionMap = await store.dispatch('getCollisionMap')
            store.commit('addCollisionMap', collisionMap)
        },

        getRecentTransactions(store, txNum: number) {
            getTransaction(null, {
                sort: 'timestamp-desc',
                limit: txNum,
                disableCount: 1,
            }).then((res) => {
                store.commit('addRecentTransactions', res.transactions)
            })
        },

        // Adds an unknown asset id to the assets dictionary
        async addUnknownAsset({ commit }, assetId: string) {
            const desc: IAssetDataAvalancheGo = await avm.getAssetDescription(
                assetId
            )
            const newAssetData: IAssetDataOrtelius = {
                alias: '',
                chainID: X_CHAIN_ID,
                currentSupply: '0',
                denomination: desc.denomination,
                id: assetId,
                name: desc.name,
                symbol: desc.symbol,
            }
            commit('addAsset', new Asset(newAssetData, true))
        },

        // DISABLED: Dispatched from Asset instance upon /aggregates response
        // checkAssetAggregatesLoaded(store) {
        //     let assetsArray = store.getters["assetsArray"];
        //     let notLoaded = assetsArray.find((element: Asset) => element.isHistoryUpdated === false);
        //     if (!notLoaded) {
        //         store.commit("finishAggregatesLoading");
        //         console.log("ALL ASSET AGGREGATES LOADED")
        //     }
        // },

        // TODO: remove when API implements precomputed aggregates
        async setAggregatesForAssetsInRecentTransactions(store) {
            const txNum = 500
            const txRes = await api.get(
                `/x/transactions?sort=timestamp-desc&limit=${txNum}`
            )
            const duplicates: string[] = []
            // find assetIDs in the txs using the inputTotals/outputTotals fields
            txRes.data.transactions.forEach((tx: ITransactionData) => {
                for (const inputAddress in tx.inputTotals) {
                    duplicates.push(inputAddress)
                }
                for (const outputAddress in tx.outputTotals) {
                    duplicates.push(outputAddress)
                }
            })
            const uniques = duplicates.filter(
                (item, i, ar) => ar.indexOf(item) === i
            )
            uniques.forEach((assetID: string) => {
                // only request aggregates for assets that are in the Ortelius assets map
                if (store.state.assets[assetID]) {
                    store.commit('addAssetToSubsetForAggregation', assetID) // initialize as [assetID]: false
                    store.commit('updateAssetWithAggregationData', assetID)
                }
            })
        },

        // dispatched from Asset instance upon /aggregates response
        // TODO: remove when API implements precomputed aggregates
        checkAssetsSubsetAggregatesLoaded(store) {
            const assetsSubsetForAggregationArray =
                store.getters['assetsSubsetForAggregationArray']
            const notLoaded = assetsSubsetForAggregationArray.find(
                (value: boolean) => value === false
            )
            if (notLoaded === undefined) {
                store.commit('finishAggregatesLoading')
                console.log('ALL ASSET AGGREGATES LOADED')
            }
        },

        getCollisionMap({ state }): ICollisionMap {
            const map: ICollisionMap = {}
            const assets = state.assets
            for (const asset in assets) {
                const symbol = assets[asset].symbol
                const id = assets[asset].id
                if (map[symbol]) {
                    map[symbol].push(id)
                } else {
                    map[symbol] = [id]
                }
            }
            return map
        },

        // TODO: move cache here
    },
    mutations: {
        addAsset(state, asset) {
            Vue.set(state.assets, asset.id, asset)
        },
        addAssetToSubsetForAggregation(state, assetID: string) {
            Vue.set(state.assetsSubsetForAggregations, assetID, false)
        },
        updateAssetInSubsetForAggregation(state, assetID: string) {
            Vue.set(state.assetsSubsetForAggregations, assetID, true)
        },
        finishLoading(state) {
            state.assetsLoaded = true
        },
        finishAggregatesLoading(state) {
            state.assetAggregatesLoaded = true
        },
        addRecentTransactions(state, transactions: ITransaction[]) {
            state.recentTransactions = transactions
        },
        updateAssetWithAggregationData(state, assetID: string) {
            //@ts-ignore
            state.assets[assetID].updateVolumeHistory()
        },
        addCollisionMap(state, collisionMap: ICollisionMap) {
            state.collisionMap = collisionMap
        },
        // DISABLED
        // updateAssetsWithAggregateData(state) {
        //     for (const assetID in state.assets) {
        //         // @ts-ignore
        //         state.assets[assetID].updateVolumeHistory();
        //     }
        // }
    },
    getters: {
        assetsArray(state: IRootState): Asset[] {
            const res: Asset[] = []
            for (const i in state.assets) {
                res.push(state.assets[i])
            }
            res.sort((a, b) => {
                const diff = b.volume_day.minus(a.volume_day)
                if (diff.gt(0)) return -1
                else if (diff.lt(0)) return 1
                else return 0
            })
            return res
        },
        assetsArrayNonProfane(state: IRootState, getters): Asset[] {
            return getters.assetsArray.filter((val: Asset) => {
                return !val.profane
            })
        },
        assetsArrayProfane(state: IRootState, getters) {
            return getters.assetsArray.filter((val: Asset) => {
                return val.profane
            })
        },
        // TODO: remove when API implements precomputed aggregates
        assetsSubsetForAggregationArray(state: IRootState): boolean[] {
            const res: boolean[] = []
            for (const i in state.assetsSubsetForAggregations) {
                res.push(state.assetsSubsetForAggregations[i])
            }
            return res
        },
        // TODO: disable-count
        totalTransactions(state: IRootState): number {
            let totalTransactions = 0
            for (const asset in state.assets) {
                totalTransactions += state.assets[asset].txCount_day
            }
            return totalTransactions
        },
    },
})
