<template>
    <div class="transactions">
        <div class="card">
            <TxHeader />
            <TxInteractive
                :transactions="transactions"
                :assets-loaded="assetsLoaded"
                :loading="loading"
                :chains="chains"
                @change="fetchTx"
            />
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import TxHeader from '@/components/Transaction/TxHeader.vue'
import TxInteractive from '@/components/Transaction/TxInteractive.vue'
import { ITransactionParams } from '@/services/transactions'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import { P, X, C } from '@/known_blockchains'

@Component({
    components: {
        TxHeader,
        TxInteractive,
    },
})
export default class Transactions extends Mixins(TransactionsGettersMixin) {
    loading = true
    filters: string[] = []
    initialParams = {
        sort: 'timestamp-desc',
        limit: 25,
    }

    created() {
        this.fetchTx(this.initialParams)
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    @Watch('assetsLoaded')
    onAssetsLoadedChanged() {
        this.fetchTx(this.initialParams)
    }

    get chains() {
        return [P, X, C]
    }

    get transactions() {
        return this.getTxs()
    }

    fetchTx(params: ITransactionParams): void {
        this.loading = true
        if (this.assetsLoaded) {
            this.$store
                .dispatch('Transactions/getTxs', {
                    id: null,
                    params,
                })
                .then(() => (this.loading = false))
        }
    }
}
</script>

<style scoped lang="scss">
.transactions {
    font-size: 12px;
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}
</style>
