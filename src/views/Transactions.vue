<template>
    <div class="transactions">
        <div class="card">
            <div class="header">
                <div class="tx_chain_header">
                    <h2>Transactions</h2>
                    <p
                        v-if="$vuetify.breakpoint.smAndUp"
                        class="chain right"
                        bottom
                    >
                        <span class="label"
                            >You are viewing transactions for</span
                        >
                        <v-tooltip>
                            <template v-slot:activator="{ on }">
                                <span class="tag" v-on="on">X-Chain</span>
                            </template>
                            <span
                                >The X-Chain acts as a decentralized platform
                                for creating and trading smart digital assets.
                                (Think X for eXchanging assets.)</span
                            >
                        </v-tooltip>
                    </p>
                </div>

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
            <template v-if="loading && !assetsLoaded">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </template>
            <template v-else>
                <TxHeader></TxHeader>
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import api from '@/axios'
import Tooltip from '@/components/rows/Tooltip.vue'
import TxHeader from '@/components/rows/TxRow/TxHeader.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import PaginationControls from '@/components/misc/PaginationControls.vue'
import { Transaction } from '@/js/Transaction'

@Component({
    components: {
        Tooltip,
        TxHeader,
        TxRow,
        PaginationControls,
    },
})
export default class Transactions extends Vue {
    loading = true
    totalTx = 0
    limit = 25 // how many to display
    offset = 0
    txs: Transaction[] = []

    created() {
        this.getTx()
    }

    get transactions() {
        return this.txs
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
        const sort = 'timestamp-desc'
        // TODO: support service for multiple chains
        const url = `/x/transactions?sort=${sort}&offset=${this.offset}&limit=${this.limit}`

        if (this.assetsLoaded) {
            api.get(url).then((res) => {
                this.txs = res.data.transactions
                this.totalTx = res.data.count
                this.loading = false
            })
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
