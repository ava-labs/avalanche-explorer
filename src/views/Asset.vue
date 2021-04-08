<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <AssetSummary v-if="asset" :asset="asset"></AssetSummary>

        <!-- TRANSACTIONS -->
        <section v-if="!txLoading && !txRequestError" class="card transactions">
            <header class="header">
                <TxHeader></TxHeader>
                <TxParams @change="fetchTx"></TxParams>
            </header>
            <div class="two-col">
                <TxFilter @change="setFilter"></TxFilter>
                <div class="right">
                    <!-- LOAD -->
                    <template v-if="!txLoading && assetsLoaded">
                        <TxTableHead></TxTableHead>
                        <v-alert
                            v-if="filteredTransactions.length === 0"
                            color="#e6f5ff"
                            dense
                        >
                            There are no matching entries
                        </v-alert>
                        <div v-else class="rows">
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
        </section>
        <HTTPError
            v-if="!txLoading && txRequestError"
            :id="assetID"
            :title="'There was an error fetching asset transactions.'"
            :status="txRequestErrorStatus"
            :message="txRequestErrorMessage"
            :support-u-r-l="'https://chat.avalabs.org'"
            :is-margin="true"
        >
        </HTTPError>

        <!-- TX GENESIS -->
        <template v-if="!genesisTx">
            <Loader
                :content-id="assetID"
                :message="'Fetching Asset Details'"
            ></Loader>
        </template>
        <template v-else>
            <TransactionDetailCard :tx="genesisTx"
                >Asset Genesis Details</TransactionDetailCard
            >
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import AssetSummary from '@/components/Asset/AssetSummary.vue'
import TransactionDetailCard from '@/components/TransactionSummary.vue'
import PaginationControls from '@/components/misc/PaginationControls.vue'
import Tooltip from '@/components/rows/Tooltip.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import { Transaction } from '../js/Transaction'
import { Asset } from '@/js/Asset'
import { getTransaction, ITransactionParams } from '@/services/transactions'
import { getAssetInfo } from '@/services/assets'
import TxHeader from '@/components/Transaction/TxHeader.vue'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import TxFilter from '@/components/Transaction/TxFilter.vue'
import TxParams from '@/components/Transaction/TxParams.vue'
import HTTPError from '@/components/misc/HTTPError.vue'
import { P, X, C } from '@/known_blockchains'

@Component({
    components: {
        Loader,
        AssetSummary,
        PaginationControls,
        TransactionDetailCard,
        Tooltip,
        TxTableHead,
        TxRow,
        TxHeader,
        TxFilter,
        TxParams,
        HTTPError,
    },
})
export default class AssetPage extends Mixins(TransactionsGettersMixin) {
    genesisTx: Transaction | null = null
    // txs
    txLoading = false
    txRequestError = false
    txRequestErrorStatus: number | null = null
    txRequestErrorMessage: string | null = null
    filters: string[] = []
    initialParams = {
        sort: 'timestamp-desc',
        limit: 25,
    }

    created() {
        this.getData(this.initialParams)
    }

    @Watch('txId')
    ontxIdChanged() {
        this.getData(this.initialParams)
    }

    @Watch('assetsLoaded')
    onAssetsLoaded() {
        this.getData(this.initialParams)
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    get breadcrumbs(): any[] {
        return [
            {
                text: 'Home',
                disabled: false,
                href: '/',
            },
            {
                text: 'Assets',
                disabled: false,
                href: '/assets',
            },
            {
                text: `${
                    this.asset
                        ? this.asset.symbol
                            ? this.asset.symbol
                            : this.asset.id
                        : 'Asset'
                }`,
                disabled: true,
                href: '',
            },
        ]
    }

    get assetID(): string {
        return this.$route.params.id
    }

    get asset(): Asset {
        return this.$store.state.assets[this.$route.params.id]
    }

    get txId(): string {
        return this.$route.params.id
    }

    setFilter(val: string[]) {
        this.filters = val
    }

    get transactions() {
        return this.getTxsByAsset()
    }

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
    }

    // get address details, txs, and genesis tx
    getData(params: ITransactionParams): void {
        this.txLoading = true

        if (this.assetsLoaded) {
            // Get genesis tx
            Promise.all([getTransaction(this.txId), getAssetInfo(this.txId)])
                .then(([transactionInfo, assetInfo]) => {
                    return {
                        ...transactionInfo,
                        ...assetInfo,
                    }
                })
                .then((data) => {
                    const tx = new Transaction(data)
                    this.genesisTx = tx
                })
                .catch((err) => {
                    console.log(err)
                })

            this.fetchTx(params)
        }
    }

    async fetchTx(params: ITransactionParams) {
        this.txLoading = true
        this.$store
            .dispatch('Transactions/getTxsByAsset', {
                id: null,
                params: {
                    assetID: this.assetID,
                    chainID: [P.id, C.id, X.id],
                    ...params,
                },
            })
            .then(() => (this.txLoading = false))
            .catch((err) => {
                this.txLoading = false
                if (err.response) {
                    console.log(err.response)
                    this.txRequestError = true
                    this.txRequestErrorStatus = err.response.status
                    this.txRequestErrorMessage = err.response.data.message
                }
            })
    }
}
</script>

<style scoped lang="scss">
$symbol_w: 35px;

.symbol {
    margin-left: 20px;
    text-align: center;
    line-height: $symbol_w;
    background-color: #f1f2f3;
    color: #000;
    font-size: 14px;
    font-weight: 400; /* 700 */
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.asset_genesis {
    margin-top: 30px;
}

@include xsOnly {
    .asset_genesis {
        margin-top: 10px;
    }
}

/* ==========================================
   transactions
   ========================================== */

.transactions {
    overflow: auto;
    margin-top: 15px;
    margin-bottom: 15px;

    .tx_rows {
        width: 100%;
        border-radius: 2px;
        margin: 2px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
    }

    .tx_item {
        border-bottom: 1px solid #e7e7e7;
    }

    .tx_table {
        font-size: 12px;
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
    .transactions {
        margin-bottom: 10px;

        .table_headers {
            display: none;
        }
    }
}
</style>
