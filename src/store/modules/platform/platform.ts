import Vue from 'vue'
import { Module } from 'vuex'
import BN from 'bn.js'
import { IRootState } from '@/store/types'
import { PlatformState } from './models'
import { platform } from '@/avalanche'
import Subnet from '@/js/Subnet'
import { ISubnetData } from './ISubnet'
import { IBlockchainData } from './IBlockchain'
import Blockchain from '@/js/Blockchain'
import { C, P } from '@/known_blockchains'
import { getAddressCounts } from '@/services/addressCounts/addressCounts.service'
import { AddressCount } from '@/services/addressCounts/models'
import { calculateStakingReward } from './helpers'
import { getTxCounts } from '@/services/transactionCounts/transactionCounts.service'
import { TxCount } from '@/services/transactionCounts/models'
import { getBurnedC } from '@/services/burned/burned.service'

export const AVALANCHE_SUBNET_ID = P.id

const platform_module: Module<PlatformState, IRootState> = {
    namespaced: true,
    state: {
        subnets: {},
        blockchains: [],
        subnetsLoaded: false,
        currentSupply: new BN(0),
        minStake: new BN(0),
        annualStakingRewardPercentage: 0,
    },
    mutations: {
        setCurrentSupply(state, currentSupply: BN) {
            state.currentSupply = currentSupply
        },
        setSubnet(state, s) {
            Vue.set(state.subnets, s.id, s)
        },
        finishLoading(state) {
            state.subnetsLoaded = true
        },
        updateChains(state, blockchains: Blockchain[]) {
            state.blockchains = blockchains
        },
        setAnnualStakingRewardPercentage(state, APR: number) {
            state.annualStakingRewardPercentage = APR
        },
    },
    actions: {
        async init({ dispatch }) {
            await dispatch('updateCurrentSupply')
            await dispatch('updateAnnualStakingRewardPercentage')
            await dispatch('getSubnets')
            dispatch('updateAddressCounts')
            dispatch('updateTxCounts')
            dispatch('updateBurned')
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
                name: P.name,
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

        async updateCurrentSupply({ commit }) {
            commit('setCurrentSupply', await platform.getCurrentSupply())
        },

        async updateMinStakeAmount({ state }) {
            state.minStake = (
                await platform.getMinStake(true)
            ).minValidatorStake
        },

        async updateAddressCounts({ state, commit }) {
            const res = await getAddressCounts()
            const updates = state.blockchains.map((chain: Blockchain) => {
                const toUpdate = chain
                const addressCount = res.find(
                    (addressCount: AddressCount) =>
                        addressCount.chainID === toUpdate.id
                )
                if (addressCount) {
                    toUpdate.updateAddressCount(addressCount.total)
                }
                return toUpdate
            })
            commit('updateChains', updates)
        },

        async updateTxCounts({ state, commit }) {
            const res = await getTxCounts()
            const updates = state.blockchains.map((chain: Blockchain) => {
                const toUpdate = chain
                const txCount = res.find(
                    (txCount: TxCount) => txCount.chainID === toUpdate.id
                )
                if (txCount) {
                    toUpdate.updateTxCount(txCount.total)
                }
                return toUpdate
            })
            commit('updateChains', updates)
        },

        async updateBurned({ state, commit }) {
            const res = await getBurnedC()
            const updates = state.blockchains.map((chain: Blockchain) => {
                const toUpdate = chain
                if (chain.id === C.id) {
                    toUpdate.updateBurned(res)
                }
                return toUpdate
            })
            commit('updateChains', updates)
        },

        async updateAnnualStakingRewardPercentage({ state, commit }) {
            const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
            const currentSupply = state.currentSupply
            const reward = calculateStakingReward(
                currentSupply,
                ONE_YEAR_SECONDS,
                currentSupply
            )
            // convert 'nAVAX BNs' to 'AVAX numbers' since BN arithmetic is buggy
            const currentSupplyAVAX = currentSupply
                .div(new BN(Math.pow(10, 9)))
                .toNumber()
            const rewardAVAX = reward.div(new BN(Math.pow(10, 9))).toNumber()
            const APR = (rewardAVAX / currentSupplyAVAX) * 100
            commit('setAnnualStakingRewardPercentage', APR)
        },
    },
}

export default platform_module
