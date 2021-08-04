import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { SourcesState } from './models'
import { getABI } from '@/services/sources/abi.service'
import {
    getEventSignature,
    getSignature,
} from '@/services/sources/signature.service'
import { getVerifiedContract } from '@/services/sources/contract.service'
//@ts-ignore
import abiDecoder from 'abi-decoder'
import {
    CanonicEventSignature,
    CanonicSignature,
    DecodedContractResponse,
    EventSignatureResponse,
    SignatureResponse,
} from '@/services/sources'
import store from '@/store'

const defaultState = {
    abisLoaded: false,
    abis: null,
    abiDecoder: null,
    signatures: [],
    eventSignatures: [],
    verifiedContracts: {},
}

const sources_module: Module<SourcesState, IRootState> = {
    namespaced: true,
    modules: {},
    state: defaultState,
    actions: {
        async init(store) {
            await store.dispatch('getFallbackABIs')
        },
        async getContract({ commit }, addressId: string) {
            if (store.state.Sources.verifiedContracts[addressId]) {
                return
            }
            const res: DecodedContractResponse = await getVerifiedContract(
                addressId
            )
            if (res.abi !== null) {
                const parsedABI = JSON.parse(res.abi)
                await abiDecoder.addABI(parsedABI)
            }
            commit('addContract', res)
        },
        // TODO: integrate with parser
        async getSignatures({ commit }, id: string) {
            const signatures: SignatureResponse = await getSignature(id)
            commit('addSignatures', signatures.results)
        },
        async getEventSignatures({ commit }, id: string) {
            const eventSignatures: EventSignatureResponse = await getEventSignature(
                id
            )
            commit('addEventSignatures', eventSignatures.results)
        },
        /**
         * Initializes the Fallback ABIs
         */
        async getFallbackABIs({ commit }) {
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
        addContract(state, verifiedContract: DecodedContractResponse) {
            state.verifiedContracts[verifiedContract.address] = verifiedContract
        },
    },
    getters: {
        getVerifiedContracts(state: SourcesState) {
            return state.verifiedContracts
        },
    },
}
export default sources_module
