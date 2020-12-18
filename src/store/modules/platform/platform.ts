import Vue from 'vue'
import { Module } from 'vuex'
import Big from 'big.js'
import BN from 'bn.js'
import { IRootState } from '@/store/types'
import { IPlatformState } from './IPlatformState'
import { platform } from '@/avalanche'
import Subnet from '@/js/Subnet'
import { ISubnetData } from './ISubnet'
import SubnetDict from '@/known_subnets'
import { IBlockchainData } from './IBlockchain'
import BlockchainDict from '@/known_blockchains'
import Blockchain from '@/js/Blockchain'

export const AVALANCHE_SUBNET_ID = Object.keys(SubnetDict).find(
    (key) => SubnetDict[key] === 'Primary Network'
) as string
export const X_CHAIN_ID = Object.keys(BlockchainDict).find(
    (key) => BlockchainDict[key] === 'X-Chain'
) as string
export const TOTAL_AVAX_SUPPLY = Big(360000000)

const platform_module: Module<IPlatformState, IRootState> = {
    namespaced: true,
    state: {
        subnets: {},
        blockchains: [],
        subnetsLoaded: false,
        currentSupply: new BN(0),
        minStake: new BN(0),
    },
    mutations: {
        setSubnet(state, s) {
            Vue.set(state.subnets, s.id, s)
        },
        finishLoading(state) {
            state.subnetsLoaded = true
        },
    },
    actions: {
        init({ dispatch }) {
            dispatch('getSubnets')
            dispatch('updateCurrentSupply')
        },

        async getSubnets({ state, commit }) {
            // Get subnets and init classes
            const subnets = ((await platform.getSubnets()) as ISubnetData[]).map(
                (s: ISubnetData) => new Subnet(s)
            )

            // Get and set validators for each subnet
            subnets.forEach((s) => {
                s.updateValidators('platform.getCurrentValidators')
                s.updateValidators('platform.getPendingValidators')
                commit('setSubnet', s)
            })

            // Get blockchains and init classes
            state.blockchains = ((await platform.getBlockchains()) as IBlockchainData[]).map(
                (b: IBlockchainData) => new Blockchain(b)
            )

            // Add P-Chain manually
            const pChain = new Blockchain({
                name: BlockchainDict[AVALANCHE_SUBNET_ID],
                id: AVALANCHE_SUBNET_ID,
                subnetID: AVALANCHE_SUBNET_ID,
                vmID: '',
            })
            state.blockchains.unshift(pChain)

            // Map blockchains to their subnet
            state.blockchains.forEach((b) => {
                const subnetID = b.subnetID
                try {
                    state.subnets[subnetID].addBlockchain(b)
                } catch (err) {
                    console.log(err)
                }
            })

            state.subnetsLoaded = true
        },

        async updateCurrentSupply({ state }) {
            state.currentSupply = await platform.getCurrentSupply()
        },

        async updateMinStakeAmount({ state }) {
            state.minStake = (
                await platform.getMinStake(true)
            ).minValidatorStake
        },
    },
    getters: {
        totalValidators(state): number {
            // Count of active validators in Primary Network
            const defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID]
            return !defaultSubnet ? 0 : defaultSubnet.validators.length
        },
        totalPendingValidators(state): number {
            // Count of pending validators in Primary Network
            const defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID]
            return !defaultSubnet ? 0 : defaultSubnet.pendingValidators.length
        },
        totalStake(state): Big {
            // Total $AVAX active stake on Primary Network
            const defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID]
            let total = Big(0)
            return !defaultSubnet
                ? total
                : (total = defaultSubnet.validators.reduce(
                      (a, v) => a.add(Big(v.totalStakeAmount as number)),
                      total
                  ))
        },
        totalPendingStake(state): Big {
            // Total $AVAX pending stake on Primary Network
            const defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID]
            let total = Big(0)
            return !defaultSubnet
                ? total
                : (total = defaultSubnet.pendingValidators.reduce(
                      (a, v) => a.add(Big(v.stakeAmount as number)),
                      total
                  ))
        },
        cumulativeStake(state): number[] {
            // Accumulative distribution of active stakes
            const defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID]
            const res: number[] = []
            let total = 0
            if (defaultSubnet) {
                defaultSubnet.validators.forEach((v) => {
                    total += v.totalStakeAmount as number
                    res.push(total)
                })
            }
            return res
        },
        cumulativePendingStake(state): number[] {
            // Accumulative distribution of pending stakes
            const defaultSubnet = state.subnets[AVALANCHE_SUBNET_ID]
            const res: number[] = []
            let total = 0
            if (defaultSubnet) {
                defaultSubnet.pendingValidators.forEach((v) => {
                    total += v.stakeAmount as number
                    res.push(total)
                })
            }
            return res
        },
        totalBlockchains(state): number {
            // Count of blockchains across all subnets
            let total = 0
            for (const subnetID of Object.keys(state.subnets)) {
                total += state.subnets[subnetID].blockchains.length
            }
            return total
        },
    },
}

export default platform_module
