import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { BlocksState, EVMBlockQueryResponse } from './models'
import { getEVMBlock } from '@/services/evmblocks'
import { parseEVMBlocks } from './helpers/parseEVMBlocks'

const defaultState = {
    evmBlock: null,
}

const blocks_module: Module<BlocksState, IRootState> = {
    namespaced: true,
    modules: {},
    state: defaultState,
    mutations: {
        addEVMBlock(state, block) {
            state.evmBlock = block
        },
    },
    actions: {
        async getEVMBlock(store, height: string) {
            const blockRes: EVMBlockQueryResponse = await getEVMBlock(height)
            if (blockRes) {
                const parsedBlock = await parseEVMBlocks(blockRes)
                store.commit('addEVMBlock', parsedBlock)
            }
        },
    },
}
export default blocks_module
