import store from '@/store'
import { TX_NAMESPACE } from './transactions.constants'

export enum TXACTION {
    FETCH_TXS = 'fetchTxs',
    FETCH_TX_RECENT = 'fetchRecentTxs',
    FETCH_TXS_BY_ASSET = 'fetchTxsByAsset',
    FETCH_TXS_BY_ADDRESS = 'fetchTxsByAddress',
}

export function dispatchFetchTxs() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.FETCH_TXS}`)
}

export function dispatchFetchRecentTxs() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.FETCH_TX_RECENT}`)
}

export function dispatchFetchTxsByAsset() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.FETCH_TXS_BY_ASSET}`)
}

export function dispatchFetchTxsByAddress() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.FETCH_TXS_BY_ADDRESS}`)
}
