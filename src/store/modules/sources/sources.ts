import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { SourcesState } from './models'
import { getABI } from '@/services/abi/abi.service'
//@ts-ignore
import abiDecoder from 'abi-decoder'

const defaultState = {
    abisLoaded: false,
    abis: null,
    abiDecoder: null,
}

const sources_module: Module<SourcesState, IRootState> = {
    namespaced: true,
    modules: {},
    state: defaultState,
    actions: {
        async init(store) {
            // Get and set initial list of all indexed assets
            await store.dispatch('getABI')
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
}
export default sources_module
