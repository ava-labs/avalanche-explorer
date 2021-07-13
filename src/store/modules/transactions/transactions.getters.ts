import store from '@/store'

export function getTx() {
    return store.state.Transactions.tx
}

export function getTxs() {
    return store.state.Transactions.txRes.transactions
}

export function getRecentTxs() {
    return store.state.Transactions.recentTxRes.transactions
}

export function getTxsByAddress() {
    return store.state.Transactions.addressTxRes.transactions
}

export function getTxsByAsset() {
    return store.state.Transactions.assetTxRes.transactions
}

export function getTxsByBlockchain() {
    return store.state.Transactions.blockchainTxRes.transactions
}

export function getEVMTx() {
    return store.state.Transactions.evmTx
}
