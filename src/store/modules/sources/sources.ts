import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { SourcesState } from './models'
import {
    getABI,
    getEventSignature,
    getSignature,
} from '@/services/abi/abi.service'
//@ts-ignore
import abiDecoder from 'abi-decoder'
import {
    CanonicEventSignature,
    CanonicSignature,
    EventSignatureResponse,
    SignatureResponse,
} from '@/services/abi'
import {
    DecodedContractResponse,
    getVerifiedContract,
} from '@/services/verifiedContract'

const defaultState = {
    abisLoaded: false,
    abis: null,
    abiDecoder: null,
    signatures: [],
    eventSignatures: [],
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
        async getVerifiedContract({ commit }, addressId: string) {
            const res: DecodedContractResponse = await getVerifiedContract(
                addressId
            )

            /*
                - Remove new lines in response.ABI
                - Add ABIs to decoder
            */
        },
        //TODO: integrate with parser
        async getSignature({ commit }, id: string) {
            const signatures: SignatureResponse = await getSignature(id)
            commit('addSignatures', signatures.results)
        },
        async getEventSignature({ commit }, id: string) {
            const eventSignatures: EventSignatureResponse = await getEventSignature(
                id
            )
            commit('addEventSignatures', eventSignatures.results)
        },
    },
    mutations: {
        addSignatures(state, signatures: CanonicSignature[]) {
            signatures.forEach((sig: CanonicSignature) => {
                state.signatures.push(sig)
            })
        },
        addEventSignatures(state, eventSignatures: CanonicEventSignature[]) {
            eventSignatures.forEach((sig: CanonicEventSignature) => {
                state.eventSignatures.push(sig)
            })
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
}
export default sources_module
