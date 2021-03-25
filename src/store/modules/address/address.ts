import Vue from 'vue'
import { Module } from 'vuex'
import api from '@/axios'
import { IRootState } from '@/store/types'
import { IAddressState } from './IAddressState'

const address_module: Module<IAddressState, IRootState> = {
    namespaced: true,
    state: {
        addresses: {},
        addressesList: [],
        addressesLoaded: false,
    },
    mutations: {
        addAddress(state, address) {
            Vue.set(state.addresses, address.id, address)
        },
        finishLoading(state) {
            state.addressesLoaded = true
        },
    },
    actions: {
        init({ dispatch }) {
            dispatch('getAddresses')
        },
        async getAddresses({ state, commit }) {
            // TODO: support service for multiple chains
            await api.get('/x/addresses').then((res) => {
                const addresses = res.data.addresses
                addresses.forEach((addressData: any) => {
                    commit('addAddress', addressData)
                })
            })
            state.addressesLoaded = true
        },
    },
    getters: {
        // addressesArray(state: IAddressState): IAddress[] {
        //     let res: IAddress[] = [];
        //     for (let i in state.addresses) {
        //         res.push(state.addresses[i]);
        //     }
        //     return res;
        // },
    },
}

export default address_module
