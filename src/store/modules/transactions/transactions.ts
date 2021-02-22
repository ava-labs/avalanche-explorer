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
        addTxs(state, txRes: ITransactionDataResponse) {
            state.txRes = txRes
        },
        addRecentTxs(state, txRes: ITransactionDataResponse) {
            state.recentTxRes = txRes
        },
        addAssetTxs(state, txRes: ITransactionDataResponse) {
            state.assetTxRes = txRes
        },
        addAddressTxs(state, txRes: ITransactionDataResponse) {
            state.addressTxRes = txRes
        },
    },
    actions: {
        async fetchTxs(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addTxs', txRes)
        },
        async fetchRecentTxs(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addRecentTxs', txRes)
        },
        async fetchTxsByAsset(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addAssetTxs', txRes)
        },
        async fetchTxsByAddress(store, payload: ITransactionPayload) {
            const txRes: ITransactionDataResponse = await getTransaction(
                payload.id,
                payload.params
            )
            store.commit('addAddressTxs', txRes)
        },
    },
}
export default transactions_module
