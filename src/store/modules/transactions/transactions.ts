import Vue from 'vue'
import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { ITransactionDataResponse, TransactionsState } from './models'
import { getTransaction, ITransactionPayload } from '@/services/transactions'

const defaultState = {
    txRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    recentTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    assetTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    addressTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
}

const transactions_module: Module<TransactionsState, IRootState> = {
    namespaced: true,
    modules: {},
    state: defaultState,
    mutations: {
        addTransactions(state, txRes: ITransactionDataResponse) {
            state.txRes = txRes
        },
        addRecentTransactions(state, txRes: ITransactionDataResponse) {
            state.recentTxRes = txRes
        },
        addAssetTransactions(state, txRes: ITransactionDataResponse) {
            state.assetTxRes = txRes
        },
        addAddressTransactions(state, txRes: ITransactionDataResponse) {
            state.addressTxRes = txRes
        },
    },
    actions: {
        async getTxs(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addTransactions', txRes)
        },
        async getRecentTxs(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addRecentTransactions', txRes)
        },
        async getTxsByAsset(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addAssetTransactions', txRes)
        },
        async getTxsByAddress(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addAddressTransactions', txRes)
        },
    },
}
export default transactions_module
