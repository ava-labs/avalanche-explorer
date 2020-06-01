import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { IPlatformState } from './IPlatformState';
import { platform } from "@/ava";
import Big from "big.js";
import Subnet from '@/js/Subnet';
import { ISubnetData } from './ISubnet';
import { IBlockchainData } from './IBlockchain';
import Vue from 'vue';

const AVA_SUBNET_ID = "11111111111111111111111111111111LpoYY";

const platform_module: Module<IPlatformState, IRootState> = {
    namespaced: true,
    state: {
        subnets: {},
        // validators: [],
        // validatorsPending: [],
    },
    mutations: {
        addSubnet(state, net){
            Vue.set(state.subnets, net.id, net);
        }
    },
    actions: {
        init({ dispatch }) {
            dispatch("getSubnets");
        },
        async getSubnets({ state, commit }) {

            // Get subnets from gecko and init classes
            let subnets = (await platform.getSubnets() as ISubnetData[]).map((s: ISubnetData) => {
                return new Subnet(s);
            });

            // Force add default subnet since it is not returned...
            // Possibly an issue with gecko

            subnets.push(new Subnet({
                id: AVA_SUBNET_ID,
                controlKeys: [],
                threshold: '1',
            }));

            subnets.forEach(s => {
                s.updateCurrentValidators();
                s.updatePendingValidators();
                // state.subnets[s.id] = s;
                commit('addSubnet', s);
            });


            // get blockchains for each subnet
            let blockchains = await platform.getBlockchains() as IBlockchainData[];

            console.log(subnets);
            console.log(blockchains);

            blockchains.forEach(b => {
                let subnetID = b.subnetID;
                console.log(subnetID);
                state.subnets[subnetID].addBlockchain(b);
            });
        }
    },
    getters: {
        avaValidatorCount(state){
            if(!state.subnets[AVA_SUBNET_ID]) return 0;
            return state.subnets[AVA_SUBNET_ID].validators.length;
        },

        avaTotalStakeAmount(state){
            if(!state.subnets[AVA_SUBNET_ID]) return Big('0');

            // Default net stake amount is the total amount
            let total = Big(0);
            let net = state.subnets[AVA_SUBNET_ID];

            let validators = net.validators;
            let totalStake = validators.reduce((acc, validator) => {
                    let stake = Big(validator.stakeAmount);
                    return acc.add(stake);
                }, total);

            return totalStake;
        },

        avaTotalPendingStakeAmount(state){
            if(!state.subnets[AVA_SUBNET_ID]) return Big('0');

            // Default net stake amount is the total amount
            let total = Big(0);
            let net = state.subnets[AVA_SUBNET_ID];

            let validators = net.pendingValidators;
            let totalStake = validators.reduce((acc, validator) => {
                let stake = Big(validator.stakeAmount);
                return acc.add(stake);
            }, total);

            return totalStake;
        },

        // cumulativeStakeAmount(){
        //     return Big(0);
        // }

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
