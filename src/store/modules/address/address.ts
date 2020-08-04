import Vue from 'vue';
import { Module } from "vuex";
import api from "@/axios";
import { IRootState } from "@/store/types";
import { IAddressState } from './IAddressState';
import { IAddress } from '@/js/IAddress';

const address_module: Module<IAddressState, IRootState> = {
    namespaced: true,
    state: {
        addresses: {},
        addressesList: [],
        addressesLoaded: false
    },
    mutations: {
        addAddress(state, address) {
            Vue.set(state.addresses, address.id, address);
        },
        finishLoading(state) {
            state.addressesLoaded = true;
        }
    },
    actions: {
        init({ dispatch }) {
            dispatch("getAddresses");
        },
        async getAddresses({ state, commit }) {
            console.log("hello!");
            await api.get("/x/addresses").then(res => {
                console.log("res", res);
                let addresses = res.data.addresses;
                console.log("ADDRESSES", addresses);
                addresses.forEach((addressData: any) => {
                    commit("addAddress", addressData);
                });
            });
            console.log("state addresses", state.addresses);
            state.addressesLoaded = true;
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
    }
};

export default address_module;
