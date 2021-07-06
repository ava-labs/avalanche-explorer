import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { BlocksState, EVMBlockQueryResponse } from './models'
import { getEVMBlock } from '@/services/evmblocks'
import { parseEVMBlocks } from './helpers/parseEVMBlocks'

const defaultState = {
    evmBlock: null,
}

const transactions_module: Module<BlocksState, IRootState> = {
    namespaced: true,
    modules: {},
    state: defaultState,
    mutations: {
        addEVMBlock(state, block: EVMBlockQueryResponse) {
            state.evmBlock = block
        },
    },
    actions: {
        async getEVMBlock(store, height: string) {
            const blockRes: EVMBlockQueryResponse = await getEVMBlock(height)
            if (blockRes) {
                parseEVMBlocks(blockRes)
                store.commit('addEVMblock', blockRes)
            }
        },
    },
}
export default transactions_module
