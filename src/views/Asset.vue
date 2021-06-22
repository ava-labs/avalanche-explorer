<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <Loader
            v-if="loading"
            :content-id="assetID"
            :message="'Fetching Asset Details'"
        />
        <template v-else>
            <AssetSummary
                v-if="asset && genesisTx"
                :asset="asset"
                :genesis-tx="genesisTx"
            />
            <!-- TRANSACTIONS -->
            <section v-if="!txRequestError" class="card transactions">
                <TxHeader />
                <TxInteractive
                    :transactions="transactions"
                    :assets-loaded="assetsLoaded"
                    :loading="loading"
                    :chains="chains"
                    @change="fetchTx"
                />
            </section>
            <HTTPError
                v-if="!txLoading && txRequestError"
                :id="assetID"
                :title="'There was an error fetching asset transactions.'"
                :status="txRequestErrorStatus"
                :message="txRequestErrorMessage"
                :support-u-r-l="'https://chat.avalabs.org'"
                :is-margin="true"
            />
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import AssetSummary from '@/components/Asset/AssetSummary.vue'
import TransactionSummary from '@/components/Transaction/TransactionSummary.vue'
import Tooltip from '@/components/rows/Tooltip.vue'
import { Transaction } from '../js/Transaction'
import { Asset } from '@/js/Asset'
import { getTransaction, ITransactionParams } from '@/services/transactions'
import { getAssetInfo } from '@/services/assets'
import TxHeader from '@/components/Transaction/TxHeader.vue'
import TxInteractive from '@/components/Transaction/TxInteractive.vue'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import HTTPError from '@/components/misc/HTTPError.vue'
import { P, X, C } from '@/known_blockchains'

@Component({
    components: {
        Loader,
        AssetSummary,
        TransactionSummary,
        Tooltip,
        TxHeader,
        TxInteractive,
        HTTPError,
    },
})
export default class AssetPage extends Mixins(TransactionsGettersMixin) {
    loading = false
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

    get chains() {
        return [P, X, C]
    }

    get transactions() {
        return this.getTxsByAsset()
    }

    getData(params: ITransactionParams): void {
        this.loading = true
        this.txLoading = true

        if (this.assetsLoaded) {
            // Get address details and genesis tx
            Promise.all([getTransaction(this.txId), getAssetInfo(this.txId)])
                .then(([transactionInfo, assetInfo]) => {
                    return {
                        ...transactionInfo,
                        ...assetInfo,
                    }
                })
                .then((data) => {
                    this.loading = false
                    this.genesisTx = new Transaction(data)
                })
                .catch((err) => {
                    this.loading = false
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
    font-weight: 400;
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.asset_genesis {
    margin-top: 30px;
}

@include xsOrSmaller {
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

@include smOnly {
    .transactions {
        margin-bottom: 10px;
    }
}
</style>
