import store from '@/store'
import { BLOCK_NAMESPACE } from './blocks.constants'

export enum BLOCKACTION {
    GET_EVM_BLOCK = 'getEVMBlock',
}

export function dispatchGetEVMBlock() {
    return store.dispatch(`${BLOCK_NAMESPACE}/${BLOCKACTION.GET_EVM_BLOCK}`)
}
