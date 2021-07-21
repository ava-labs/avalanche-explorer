import Vue from 'vue'
import Vuex from 'vuex'
import { Asset } from '@/js/Asset'
import { IRootState } from '@/store/types'
import AddressDict from '@/known_addresses'
import Platform from './modules/platform/platform'
import Address from './modules/address/address'
import Network from './modules/network/network'
import Notifications from './modules/notifications/notifications'
import Transactions from './modules/transactions/transactions'
import Blocks from './modules/blocks/blocks'
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
import { X } from '@/known_blockchains'
import { getCacheAssets } from '@/services/assets'
import { getPrices, Price, PriceMap } from '@/services/price'
import { AVAX_PRICE_ID, VS_CURRENCIES } from '@/known_prices'
import { getABI } from '@/services/abi/abi.service'
//@ts-ignore
import abiDecoder from 'abi-decoder'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        Platform,
        Address,
        Notifications,
        Network,
        Transactions,
        Blocks,
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
        pricesLoaded: false,
        prices: null,
        abisLoaded: false,
        abis: null,
        abiDecoder: null,
    } as IRootState,
    actions: {
        async init(store) {
            // Get and set initial list of all indexed assets
            await store.dispatch('getAssets')
            store.dispatch('getPrice')
            store.dispatch('getABI')

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
            const assetsData = await getCacheAssets()
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

        async getPrice({ commit }) {
            const price: PriceMap = await getPrices({
                ids: [AVAX_PRICE_ID],
                vs_currencies: [VS_CURRENCIES],
            })
            commit('addPrices', price[AVAX_PRICE_ID])
            commit('finishPricesLoading')
        },

        async getABI({ commit }) {
            const ERC20: any = await getABI('erc20')
            const ERC721: any = await getABI('erc721')

            const ERC20Events = ERC20.filter((i: any) => i.type === 'event')
            abiDecoder.addABI(ERC20Events)

            // TODO: Deal with collisions due to canonical sigs
            // const ERC721Events = ERC721.filter((i: any) => i.type === 'event')
            // abiDecoder.addABI(ERC721Events)

            const ABIS = {
                erc20: ERC20,
                erc721: ERC721,
            }
            commit('addABIs', ABIS)
            commit('addABIDecoder', abiDecoder)
            commit('finishABIsLoading')
        },
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
        },
        // TRANSACTIONS
        addRecentTransactions(state, txRes: TransactionQuery) {
            state.recentTxRes = txRes
        },
        addCollisionMap(state, collisionMap: ICollisionMap) {
            state.collisionMap = collisionMap
        },
        addPrices(state, prices: Price) {
            state.prices = prices
        },
        finishPricesLoading(state) {
            state.pricesLoaded = true
        },
        addABIs(state, abis: any) {
            state.abis = abis
        },
        finishABIsLoading(state) {
            state.abisLoaded = true
        },
        addABIDecoder(state, abiDecoder: any) {
            state.abiDecoder = abiDecoder
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
