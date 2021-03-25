<template>
    <div class="transactions">
        <div class="card">
            <div class="header">
                <TransactionsHeader></TransactionsHeader>
                <TxParams @change="fetchTx"></TxParams>
            </div>
            <div class="two-col">
                <TxFilter @change="setFilter"></TxFilter>
                <div class="right">
                    <template v-if="!loading && assetsLoaded">
                        <TxTableHead></TxTableHead>
                        <v-alert
                            v-if="filteredTransactions.length === 0"
                            color="#e6f5ff"
                            dense
                        >
                            There are no matching entries
                        </v-alert>
                        <div class="rows">
                            <transition-group name="fade" mode="out-in">
                                <tx-row
                                    v-for="tx in filteredTransactions"
                                    :key="tx.id"
                                    class="tx_item"
                                    :transaction="tx"
                                ></tx-row>
                            </transition-group>
                        </div>
                    </template>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    ></v-progress-circular>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'
import TxFilter from '@/components/Transaction/TxFilter.vue'
import TxParams from '@/components/Transaction/TxParams.vue'
import DateForm from '@/components/misc/DateForm.vue'
import { ITransactionParams } from '@/services/transactions'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'

@Component({
    components: {
        Tooltip,
        TxTableHead,
        TxRow,
        TransactionsHeader,
        DateForm,
        TxFilter,
        TxParams,
    },
})
export default class Transactions extends Mixins(TransactionsGettersMixin) {
    loading = true
    filters: string[] = []

    created() {
        this.fetchTx({
            sort: 'timestamp-desc',
            limit: 25,
        })
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    @Watch('assetsLoaded')
    onAssetsLoadedChanged() {
        this.fetchTx({
            sort: 'timestamp-desc',
            limit: 25,
        })
    }

    setFilter(val: string[]) {
        this.filters = val
    }

    get transactions() {
        return this.getTxs()
    }

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
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

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;
}

.tx_item {
    border-bottom: 1px solid #e7e7e7;

    &:last-of-type {
        border: none !important;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

.two-col {
    display: flex;
    flex-direction: row;

    .left {
        h4 {
            margin-top: 0;
        }
        flex-basis: 0 0 300px;
        margin-right: 60px;
    }

    .right {
        flex: 1;
    }
}

@include smOnly {
    .table_headers {
        display: none;
    }
}
</style>
