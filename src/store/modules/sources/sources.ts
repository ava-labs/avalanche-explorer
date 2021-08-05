import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { SourcesState } from './models'
import { getABI } from '@/services/sources/abi.service'
import {
    getEventSignature,
    getFunctionSignature,
} from '@/services/sources/signature.service'
import { getVerifiedContract } from '@/services/sources/contract.service'
//@ts-ignore
import abiDecoder from 'abi-decoder'
import {
    EventSignature,
    FunctionSignature,
    DecodedContractResponse,
    EventSignatureResponse,
    FunctionSignatureResponse,
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
        /**
         * FIRST PREFERENCE - VERIFIED CONTRACT SOURCE
         * find sourcecode of a verified smart contract
         *      Included    contractName, source code, ABIs for all function/event names and types
         * @param param0
         * @param addressId
         *
         */
        async getContract({ commit }, addressId: string) {
            if (store.state.Sources.verifiedContracts[addressId]) {
                return
            }
            const res: DecodedContractResponse = await getVerifiedContract(
                addressId
            )
            console.log('verified contract res: ', res)
            if (res.abi !== null) {
                const parsedABI = JSON.parse(res.abi)
                console.log('parsedABI', parsedABI)
                await abiDecoder.addABI(parsedABI)
            }
            await commit('addContract', res)
        },
        /**
         * PREFERENCE 2 - 4-BYTE FUNCTION SIGNATURES
         * find text signatures that match the encoded function (warning: there may be collisions)
         *      Included        methodName, paramType
         *      Not included    paramName, returnType
         * @param param0
         * @param methodId
         */
        async getFunctionSignatures({ commit }, methodId: string) {
            const signatures: FunctionSignatureResponse = await getFunctionSignature(
                methodId
            )
            commit('addFunctionSignatures', signatures.results)
        },
        /**
         * PREFERENCE 2 - EVENT SIGNATURES
         * find text signatures that match the encoded event (warning: there may be collisions)
         * warning: there may be collisions
         *      Included        eventName and paramTypes
         *      Not included    paramNames
         * @param param0
         * @param eventId
         */
        async getEventSignatures({ commit }, eventId: string) {
            const eventSignatures: EventSignatureResponse = await getEventSignature(
                eventId
            )
            commit('addEventSignatures', eventSignatures.results)
        },
        /**
         * PREFERENCE 3 - HARDCODED ABIs
         * find signatures using common interfaces (ERC20, 721, etc.) as a last resort
         * @param param0
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
        addFunctionSignatures(state, signatures: FunctionSignature[]) {
            signatures.forEach((sig: FunctionSignature) => {
                state.signatures.push(sig)
            })
        },
        addEventSignatures(state, eventSignatures: EventSignature[]) {
            eventSignatures.forEach((sig: EventSignature) => {
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
        getABIDecoder(state: SourcesState) {
            return state.abiDecoder
        },
    },
}
export default sources_module
