import Vue from 'vue'
import Vuex from 'vuex'
import api from '../axios'
import { Asset } from '@/js/Asset'
import { IRootState } from '@/store/types'
import AddressDict from '@/known_addresses'
import Platform from './modules/platform/platform'
import Address from './modules/address/address'
import Network from './modules/network/network'
import Notifications from './modules/notifications/notifications'
import Transactions from './modules/transactions/transactions'
import { avm } from '@/avalanche'
import {
    IAssetDataOrtelius,
    IAssetDataAvalancheGo,
    ICollisionMap,
} from '@/js/IAsset'
import {
    TransactionQuery,
    TransactionQueryResponse,
} from '@/store/modules/transactions/models'
import { ITransactionPayload } from '@/services/transactions'
import { getTransaction } from '@/services/transactions'
import { getAssetAggregates, IAssetAggregate } from '@/services/aggregates'
import { parseTxs } from './modules/transactions/helpers'
import { isMainnetNetwork, X } from '@/known_blockchains'
import { getCacheAssets } from '@/services/assets'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        Platform,
        Address,
        Notifications,
        Network,
        Transactions,
    },
    state: {
        assets: {},
        assetsLoaded: false,
        assetAggregatesLoaded: false,
        known_addresses: AddressDict,
        chainId: 'X',
        recentTxRes: {},
        assetsSubsetForAggregations: {}, // TODO: remove eventually
        // this is a bandaid until the API precomputes aggregate data for assets
        // it holds a subset of the assets and checks if they have aggregation data
        // temporarily responsible for triggering assetAggregatesLoaded
        collisionMap: {},
    } as IRootState,
    actions: {
        async init(store) {
            // Get and set initial list of all indexed assets
            await store.dispatch('getAssets')

            // Once we have assets, next get recent transactions
            store.dispatch('getRecentTransactions', {
                id: null,
                params: {
                    sort: 'timestamp-desc',
                    limit: 10,
                },
            })

            // Then get asset aggregation data
            store.dispatch('getAssetAggregates')

            // Uniqueify Symbols
            const collisionMap = await store.dispatch('getCollisionMap')
            store.commit('addCollisionMap', collisionMap)
        },

        /**
         * Get and set initial list of all indexed assets
         */
        async getAssets(store) {
            let assetsData = []

            if (isMainnetNetwork()) {
                // TODO: support service for multiple chains
                let isFinished = false
                let offset = 0
                const limit = 500
                const res = await api.get(
                    `/x/assets?offset=${offset}&limit=${limit}`
                )
                assetsData = res.data.assets

                while (isFinished === false) {
                    // keep getting asset data as necessary
                    await (async function () {
                        offset += limit
                        const res = await api.get(
                            `/x/assets?offset=${offset}&limit=${limit}`
                        )
                        const moreAssets = res.data.assets
                        if (moreAssets.length === 0) {
                            isFinished = true
                        }
                        assetsData.push(...moreAssets)
                    })()
                }
            } else {
                assetsData = await getCacheAssets()
            }

            // once we get all the data, instantiate assets and save them to the store
            assetsData.forEach((assetData: any) => {
                store.commit('addAsset', new Asset(assetData, false))
            })
            store.commit('finishLoading')
        },

        async getAssetAggregates(store) {
            const assetAggregates: IAssetAggregate[] = await getAssetAggregates()
            assetAggregates.forEach((agg: IAssetAggregate) => {
                // only request aggregates for assets that are in the Ortelius assets map
                if (store.state.assets[agg.asset]) {
                    store.commit('updateAssetWithAggregationData', agg)
                }
            })
            store.commit('finishAggregatesLoading')
        },

        async getRecentTransactions(store, payload: ITransactionPayload) {
            const txRes: TransactionQueryResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addRecentTransactions', parseTxs(txRes))
        },

        // Adds an unknown asset id to the assets dictionary
        async addUnknownAsset({ commit }, assetId: string) {
            const desc: IAssetDataAvalancheGo = await avm.getAssetDescription(
                assetId
            )
            const newAssetData: IAssetDataOrtelius = {
                alias: '',
                chainID: X.id,
                currentSupply: '0',
                denomination: desc.denomination,
                id: assetId,
                name: desc.name,
                symbol: desc.symbol,
                timestamp: '',
                variableCap: 0,
                nft: 0,
                aggregates: null,
            }
            commit('addAsset', new Asset(newAssetData, true))
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
        finishLoading(state) {
            state.assetsLoaded = true
        },
        // ASSETS
        addAsset(state, asset) {
            Vue.set(state.assets, asset.id, asset)
        },
        addAssetToSubsetForAggregation(state, assetID: string) {
            Vue.set(state.assetsSubsetForAggregations, assetID, false)
        },
        updateAssetInSubsetForAggregation(state, assetID: string) {
            Vue.set(state.assetsSubsetForAggregations, assetID, true)
        },
        updateAssetWithAggregationData(state, agg: IAssetAggregate) {
            //@ts-ignore
            state.assets[agg.asset].updateAggregates(agg.aggregate.aggregates)
        },
        finishAggregatesLoading(state) {
            state.assetAggregatesLoaded = true
            console.log('ALL ASSET AGGREGATES LOADED')
        },
        // TRANSACTIONS
        addRecentTransactions(state, txRes: TransactionQuery) {
            state.recentTxRes = txRes
        },
        addCollisionMap(state, collisionMap: ICollisionMap) {
            state.collisionMap = collisionMap
        },
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
export default store
