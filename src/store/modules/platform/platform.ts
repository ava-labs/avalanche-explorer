import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { IPlatformState } from './IPlatformState';
import { platform } from "@/ava";
import Big from "big.js";
import Subnet from '@/js/Subnet';
import { ISubnetData } from './ISubnet';
import { IBlockchainData } from './IBlockchain';

const platform_module: Module<IPlatformState, IRootState> = {
    namespaced: true,
    state: {
        subnets: {},
        // validators: [],
        // validatorsPending: [],
    },
    mutations: {
    },
    actions: {
        init({ dispatch }) {
            dispatch("getSubnets");
        },
        async getSubnets({ state }) {
            let subnets = (await platform.getSubnets() as ISubnetData[]).map((s: ISubnetData) => {
                return new Subnet(s);
            });
            subnets.forEach(s => state.subnets[s.id] = s);
            
            // get blockchains for each subnet
            let blockchains = await platform.getBlockchains() as IBlockchainData[];
            blockchains.forEach(b => {
                let subnetID = b.id;
                state.subnets[subnetID].addBlockchain(b);
            });
        }
    },
    getters: {
        // totalStakeAmount(state) {
        //     let res = Big(0);
        //     state.validators.forEach(validator => {
        //         res = res.add(validator.stakeAmount)
        //     });
        //     return res;
        // },
        // cumulativeStakeAmount(state) {
        //     let res: Big[] = [];
        //     let total = Big(0);
        //     state.validators.forEach(validator => {
        //         let val = Big(validator.stakeAmount);
        //         total = total.add(val);
        //         res.push(total)
        //     });
        //     return res;
        // },
        // totalStakeAmountPending(state) {
        //     let res = Big(0);
        //     state.validatorsPending.forEach(validator => {
        //         res = res.add(validator.stakeAmount)
        //     });
        //     return res;
        // },
        // cumulativeStakeAmountPending(state) {
        //     let res: Big[] = [];
        //     let total = Big(0);
        //     state.validatorsPending.forEach(validator => {
        //         let val = Big(validator.stakeAmount);
        //         total = total.add(val);
        //         res.push(total)
        //     });
        //     return res;
        // }
    }
};

export default platform_module;
