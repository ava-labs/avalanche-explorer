<template>
    <div class="transactions">
        <div class="card">
            <!-- HEADER -->
            <div class="header">
                <TransactionsHeader></TransactionsHeader>
                <!-- COUNT/PAGINATION -->
                <template v-show="!loading && assetsLoaded">
                    <div class="bar">
                        <p class="count"></p>
                        <!-- <TxPaginationControls
                            v-show="assetsLoaded"
                            ref="paginationTop"
                            :total="totalTx"
                            :limit="limit"
                            @change="page_change"
                        ></TxPaginationControls> -->
                    </div>
                    <div class="bar">
                        <div class="sort_container">
                            <v-select
                                v-model="sort"
                                :items="sorts"
                                item-text="label"
                                item-value="query"
                                label="Sort by"
                                dense
                                color="#4c2e56"
                            ></v-select>
                        </div>
                        <DateForm
                            :class="sort === 'timestamp-desc' ? 'reverse' : ''"
                            @change_start="setStart"
                            @change_end="setEnd"
                        ></DateForm>
                        <div class="limit_container">
                            <v-select
                                v-model="limit"
                                :items="limits"
                                label="Results"
                                dense
                                color="#4c2e56"
                            ></v-select>
                        </div>
                        <v-btn
                            class="search_tx_btn ava_btn"
                            text
                            @click="submit"
                            >Search</v-btn
                        >
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
                    <!-- <TxPaginationControls
                        ref="paginationBottom"
                        :total="totalTx"
                        :limit="limit"
                        @change="page_change"
                    ></TxPaginationControls> -->
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch, Mixins } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import TxPaginationControls from '@/components/Transaction/TxPaginationControls.vue'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'
import DateForm from '@/components/misc/DateForm.vue'
import { ITransactionParams } from '@/services/transactions'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'

@Component({
    components: {
        Tooltip,
        TxTableHead,
        TxRow,
        TxPaginationControls,
        TransactionsHeader,
        DateForm,
    },
})
export default class Transactions extends Mixins(TransactionsGettersMixin) {
    loading = true
    totalTx = 0

    startDate: string = new Date().toISOString()
    endDate: string = new Date().toISOString()
    // Sort
    sort = 'timestamp-desc'
    sorts = [
        {
            label: 'Most Recent',
            query: 'timestamp-desc',
        },
        {
            label: 'Oldest',
            query: 'timestamp-asc',
        },
    ]
    // Limits
    limit = 25
    limits = [10, 25, 100, 1000, 5000]

    offset = 0

    created() {
        this.getTx()
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    @Watch('assetsLoaded')
    onAssetsLoadedChanged() {
        this.getTx()
    }

    setStart(val: string) {
        this.startDate = val
    }

    setEnd(val: string) {
        this.endDate = val
    }

    get transactions() {
        return this.getTxs()
    }

    get firstEndTime(): number {
        return (
            new Date(this.$store.state.Transactions.txRes.endTime).getTime() /
            1000
        )
    }

    get prevEndTime(): number | null {
        return this.$store.state.Transactions.txRes.endTime
            ? new Date(this.$store.state.txRes.endTime).getTime() / 1000
            : null
    }

    get lastEndTime(): number | null {
        return this.$store.state.Transactions.txRes.endTime
            ? new Date(this.$store.state.txRes.endTime).getTime() / 1000
            : null
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

    submit() {
        this.loading = true

        // startTime: "0001-01-01T00:00:00Z"
        // endTime: "2021-02-04T02:53:30Z"
        // next: "endTime=1612407093&limit=25&sort=timestamp-desc"
        // 1612407210

        if (this.assetsLoaded) {
            let params: ITransactionParams = {
                sort: this.sort,
                limit: this.limit,
            }

            if (this.sort === 'timestamp-desc') {
                params = {
                    endTime: Math.round(
                        new Date(this.endDate).getTime() / 1000
                    ),
                    ...params,
                }
                console.log('params', params)
            } else {
                params = {
                    startTime: Math.round(
                        new Date(this.startDate).getTime() / 1000
                    ),
                    ...params,
                }
                console.log('params', params)
            }

            this.$store
                .dispatch('Transactions/getTxs', {
                    id: null,
                    params,
                })
                .then(() => (this.loading = false))
        }
    }

    getTx(): void {
        this.loading = true

        // TODO: support service for multiple chains
        if (this.assetsLoaded) {
            this.$store
                .dispatch('Transactions/getTxs', {
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

.request {
    border-bottom: 1px solid $gray;
}

.sort_container {
    width: 150px;
    padding-top: 20px;
    padding-right: 15px;
}

.limit_container {
    width: 100px;
    padding-top: 20px;
    padding-right: 15px;
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
