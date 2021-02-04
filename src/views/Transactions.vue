<template>
    <div class="transactions">
        <div class="card">
            <!-- HEADER -->
            <div class="header">
                <TransactionsHeader></TransactionsHeader>
                <!-- COUNT/PAGINATION -->
                <template v-show="!loading && assetsLoaded">
                    <div class="bar">
                        <p class="count">
                            {{ totalTx.toLocaleString() }} transactions found
                        </p>
                        <pagination-controls
                            v-show="assetsLoaded"
                            ref="paginationTop"
                            :total="totalTx"
                            :limit="limit"
                            @change="page_change"
                        ></pagination-controls>
                    </div>
                </template>
            </div>

            <!-- LOAD -->
            <template v-if="loading && !assetsLoaded">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </template>

            <!-- TBODY -->
            <template v-else>
                <TxTableHead></TxTableHead>
                <div class="rows">
                    <transition-group name="fade" mode="out-in">
                        <tx-row
                            v-for="tx in transactions"
                            :key="tx.id"
                            class="tx_item"
                            :transaction="tx"
                        ></tx-row>
                    </transition-group>
                </div>
                <div class="bar-table">
                    <pagination-controls
                        ref="paginationBottom"
                        :total="totalTx"
                        :limit="limit"
                        @change="page_change"
                    ></pagination-controls>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import PaginationControls from '@/components/misc/PaginationControls.vue'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'

@Component({
    components: {
        Tooltip,
        TxTableHead,
        TxRow,
        PaginationControls,
        TransactionsHeader,
    },
})
export default class Transactions extends Vue {
    loading = true
    totalTx = 0
    limit = 25 // how many to display
    offset = 0
    sort = 'timestamp-desc'

    created() {
        this.getTx()
    }

    get transactions() {
        return this.$store.state.txRes.transactions
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    @Watch('assetsLoaded')
    onAssetsLoadedChanged() {
        this.getTx()
    }

    page_change(val: number) {
        this.offset = val
        this.getTx()
        const pgNum = Math.floor(this.offset / this.limit) + 1
        // @ts-ignore
        this.$refs.paginationTop.setPage(pgNum)
        // @ts-ignore
        this.$refs.paginationBottom.setPage(pgNum)
    }

    getTx(): void {
        this.loading = true

        // TODO: support service for multiple chains
        if (this.assetsLoaded) {
            this.$store
                .dispatch('getTransactions', {
                    mutation: 'addTransactions',
                    id: null,
                    params: {
                        sort: this.sort,
                        limit: this.limit,
                    },
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

    .count {
        color: #808080;
    }
}

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
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

@include smOnly {
    .table_headers {
        display: none;
    }
}
</style>
