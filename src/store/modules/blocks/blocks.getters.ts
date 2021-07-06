import store from '@/store'

export function getEVMBlock() {
    return store.state.Blocks.evmBlock
}
