import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { IPlatformState } from './IPlatformState';
import { platform } from "@/avalanche";
import Big from "big.js";
import Subnet from '@/js/Subnet';
import { ISubnetData } from './ISubnet';
import { IBlockchainData } from './IBlockchain';
import Vue from 'vue';

export const AVALANCHE_SUBNET_ID = "11111111111111111111111111111111LpoYY";

const platform_module: Module<IPlatformState, IRootState> = {
    namespaced: true,
    state: {
        subnets: {},
        subnetsLoaded: false
    },
    mutations: {
        setSubnet(state, s) {
            Vue.set(state.subnets, s.id, s);
        },
        finishLoading(state) {
            state.subnetsLoaded = true;
        }
    },
    actions: {
        init({ dispatch }) {
            dispatch("getSubnets");
        },
        async getSubnets({ state, commit }) {
            // Get subnets and init classes
            let subnets = (await platform.getSubnets() as ISubnetData[])
                .map((s: ISubnetData) => new Subnet(s));

            // Get and set validators for each subnet
            subnets.forEach(s => {
                s.updateValidators("platform.getCurrentValidators");
                s.updateValidators("platform.getPendingValidators");
                commit("setSubnet", s);
            });

            // Get blockchains
            let blockchains = await platform.getBlockchains() as IBlockchainData[];

            // Add P-Chain manually
            blockchains.unshift({
                name: "P-Chain",
                id: "11111111111111111111111111111111LpoYY",
                subnetID: "11111111111111111111111111111111LpoYY",
                vmID: ""
            });

            // Map blockchains to their subnet
            blockchains.forEach(b => {
                let subnetID = b.subnetID;
                state.subnets[subnetID].addBlockchain(b);
            });

            state.subnetsLoaded = true;
        }
    },
    getters: {
        totalValidators(state): number {
            // Count of active validators in default subnet
            let defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID];
            return (!defaultSubnet) ?
                0 : defaultSubnet.validators.length;
        },
        totalPendingValidators(state): number {
            // Count of pending validators in default subnet
            let defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID];
            return (!defaultSubnet) ?
                0 : defaultSubnet.pendingValidators.length;
        },
        totalStake(state): Big {
            // Total $AVAX active stake on default subnet
            let defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID];
            let total = Big(0);
            return (!defaultSubnet) ? total :
                total = defaultSubnet.validators.reduce((a, v) => a.add(Big(v.stakeAmount as number)), total);
        },
        totalPendingStake(state): Big {
            // Total $AVAX pending stake on default subnet
            let defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID];
            let total = Big(0);
            return (!defaultSubnet) ? total :
                total = defaultSubnet.pendingValidators.reduce((a, v) => a.add(Big(v.stakeAmount as number)), total);
        },
        cumulativeStake(state): number[] {
            // Accumulative distribution of active stakes
            let defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID];
            let res: number[] = [];
            let total = 0;
            if (defaultSubnet) {
                defaultSubnet.validators.forEach(v => {
                    total += v.stakeAmount as number;
                    res.push(total)
                });
            }
            return res;
        },
        cumulativePendingStake(state): number[] {
            // Accumulative distribution of pending stakes
            let defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID];
            let res: number[] = [];
            let total = 0;
            if (defaultSubnet) {
                defaultSubnet.pendingValidators.forEach(v => {
                    total += v.stakeAmount as number;
                    res.push(total)
                });
            }
            return res;
        },
        totalBlockchains(state): number {
            // Count of blockchains across all subnets
            let total = 0;
            for (const subnetID of Object.keys(state.subnets)) {
                total += state.subnets[subnetID].blockchains.length;
            }
            return total;
        }
    }
};

export default platform_module;
