<template>
    <div class="transactions">
        <div class="card">
            <!-- HEADER -->
            <div class="header">
                <TransactionsHeader></TransactionsHeader>
                <template v-show="!loading && assetsLoaded">
                    <!-- REQUEST PARAMS -->
                    <div class="params">
                        <h4>Search</h4>
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
                                :class="
                                    sort === 'timestamp-desc' ? 'reverse' : ''
                                "
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
                    </div>
                </template>
            </div>
            <div class="two-col">
                <!-- FILTER PARAMS -->
                <div class="left">
                    <h4>Filter Results</h4>
                    <div>
                        <div>
                            <h5>Filter by Chain and Tx Type</h5>
                            <v-treeview
                                v-model="selection"
                                selectable
                                :selection-type="'leaf'"
                                selected-color="#e84970"
                                item-disabled="locked"
                                :items="items"
                                return-object
                                open-all
                            ></v-treeview>
                        </div>
                    </div>
                </div>
                <div class="right">
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
                                    v-for="tx in filteredTransactions"
                                    :key="tx.id"
                                    class="tx_item"
                                    :transaction="tx"
                                ></tx-row>
                            </transition-group>
                        </div>
                    </template>
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
import TxPaginationControls from '@/components/Transaction/TxPaginationControls.vue'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'
import DateForm from '@/components/misc/DateForm.vue'
import { ITransactionParams } from '@/services/transactions'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import { CCHAINID, PCHAINID, XCHAINID } from '@/known_blockchains'

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
    // Query Params
    startDate: string = new Date().toISOString()
    endDate: string = new Date().toISOString()
    sort = 'timestamp-desc'
    sorts = [
        {
            label: 'New to Old',
            query: 'timestamp-desc',
        },
        {
            label: 'Old to New',
            query: 'timestamp-asc',
        },
    ]
    limit = 25
    limits = [10, 25, 100, 1000, 5000]

    // Filter Params
    items = [
        {
            id: PCHAINID,
            name: 'P-Chain (Platform)',
            children: [
                { id: 'add_validator', name: 'Add Validator' },
                { id: 'add_subnet_validator', name: 'Add Subnet Validator' },
                { id: 'add_delegator', name: 'Add Delegator' },
                { id: 'create_subnet', name: 'Create Subnet' },
                { id: 'create_chain', name: 'Create Chain' },
                { id: 'pvm_export', name: 'PVM Export' },
                { id: 'pvm_import', name: 'PVM Import' },
            ],
        },
        {
            id: XCHAINID,
            name: 'X-Chain (Exchange)',
            children: [
                { id: 'base', name: 'Base' },
                { id: 'create_asset', name: 'Create Asset' },
                { id: 'operation', name: 'Operation' },
                { id: 'import', name: 'Import' },
                { id: 'export', name: 'Export' },
            ],
        },
        {
            id: CCHAINID,
            name: 'C-Chain (Contract)',
            children: [
                { id: 'atomic_import_tx', name: 'Atomic Import' },
                { id: 'atomic_export_tx', name: 'Atomic Export' },
            ],
        },
    ]
    selection = this.items.flatMap((item) => item.children)

    offset = 0

    created() {
        this.fetchTx()
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    @Watch('assetsLoaded')
    onAssetsLoadedChanged() {
        this.fetchTx()
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

    get filters() {
        return this.selection.map((val) => val.id)
    }

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
    }

    submit() {
        this.loading = true

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
            } else {
                params = {
                    startTime: Math.round(
                        new Date(this.startDate).getTime() / 1000
                    ),
                    ...params,
                }
            }

            this.$store
                .dispatch('Transactions/getTxs', {
                    id: null,
                    params,
                })
                .then(() => (this.loading = false))
        }
    }

    fetchTx(): void {
        this.loading = true
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

.params {
    h4 {
        margin-top: 30px;
        margin-bottom: 0;
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
    padding-top: 19px;
    padding-right: 15px;
}

.limit_container {
    width: 100px;
    padding-top: 19px;
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
