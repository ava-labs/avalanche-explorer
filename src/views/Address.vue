<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Loader
            v-if="loading && !requestError"
            :content-id="addressID"
            :message="'Fetching Address Details'"
        />
        <!-- ADDRESS SUMMARY -->
        <Metadata
            v-if="metadata && !requestError && assetsLoaded === true"
            :meta-data="metadata"
            :address-i-d="addressID"
            :alias="alias"
            :total-transaction-count="totalTransactionCount"
            :total-utxo-count="totalUtxoCount"
            :assets="assets"
            :prefix="prefix"
        />
        <HTTPError
            v-if="!loading && requestError"
            :id="addressID"
            :title="'There was an error fetching address details.'"
            :status="requestErrorStatus"
            :message="requestErrorMessage"
            :support-u-r-l="'https://chat.avalabs.org'"
        />
        <!-- TRANSACTIONS -->
        <section v-if="!loading && !txRequestError" class="card transactions">
            <div class="header">
                <TransactionsHeader />
                <TxParams @change="fetchTx" />
            </div>
            <div class="two-col">
                <TxFilter @change="setFilter" />
                <div class="right">
                    <!-- LOAD -->
                    <template v-if="!txLoading && assetsLoaded">
                        <TxTableHead />
                        <v-alert
                            v-if="filteredTransactions.length === 0"
                            color="#e6f5ff"
                            dense
                        >
                            There are no matching entries
                        </v-alert>
                        <div v-else class="rows">
                            <transition-group name="fade" mode="out-in">
                                <TxRow
                                    v-for="tx in filteredTransactions"
                                    :key="tx.id"
                                    class="tx_item"
                                    :transaction="tx"
                                />
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
                    />
                </div>
            </div>
        </section>
        <HTTPError
            v-if="!txLoading && txRequestError"
            :id="addressID"
            :title="'There was an error fetching address transactions.'"
            :status="txRequestErrorStatus"
            :message="txRequestErrorMessage"
            :support-u-r-l="'https://chat.avalabs.org'"
            :is-margin="true"
        />
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import Tooltip from '@/components/rows/Tooltip.vue'
import Metadata from '@/components/Address/Metadata.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import AddressDict from '@/known_addresses'
import { IBalanceX, IAddress } from '@/services/addresses/models'
import { getAddress } from '@/services/addresses/addresses.service'
import Big from 'big.js'
import HTTPError from '@/components/misc/HTTPError.vue'
import TxHeader from '@/components/Transaction/TxHeader.vue'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'
import DateForm from '@/components/misc/DateForm.vue'
import { ITransactionParams } from '@/services/transactions'
import TxFilter from '@/components/Transaction/TxFilter.vue'
import TxParams from '@/components/Transaction/TxParams.vue'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'

@Component({
    components: {
        Loader,
        Tooltip,
        HTTPError,
        Metadata,
        TransactionsHeader,
        DateForm,
        TxTableHead,
        TxRow,
        TxHeader,
        TxFilter,
        TxParams,
    },
    filters: {
        pluralize(val: number) {
            return val === 0
                ? `${val} assets`
                : val > 1
                ? `${val} assets`
                : `${val} asset`
        },
    },
})
export default class AddressPage extends Mixins(TransactionsGettersMixin) {
    // navigation
    breadcrumbs: any[] = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Address',
            disabled: true,
            href: '',
        },
    ]
    // details
    loading = false
    requestError = false
    requestErrorStatus: number | null = null
    requestErrorMessage: string | null = null
    metadata: IAddress | null = null
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

    async created() {
        this.updateData(this.initialParams)
    }

    @Watch('address')
    onAddressChanged() {
        this.updateData(this.initialParams)
    }

    @Watch('assetsLoaded')
    onAssetsLoaded() {
        this.updateData(this.initialParams)
    }

    @Watch('$route')
    onRouteChanged() {
        this.updateData(this.initialParams)
    }

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get alias(): string {
        return AddressDict[this.addressID] ? AddressDict[this.addressID] : ''
    }

    get assets(): IBalanceX[] {
        return this.metadata ? this.metadata.assets : []
    }

    get assetsMap(): any {
        return this.$store.state.assets
    }

    get addressID(): string {
        let address = this.$route.params.address
        if (address.indexOf('-') === 1) {
            address = address.substring(2, address.length)
        }
        return address
    }

    get prefix(): string {
        const address = this.$route.params.address
        return address.substring(0, 1)
    }

    get totalTransactionCount(): number {
        return this.metadata ? this.metadata.totalTransactionCount : 0
    }

    get totalUtxoCount(): number {
        return this.metadata ? this.metadata.totalUtxoCount : 0
    }

    setFilter(val: string[]) {
        this.filters = val
    }

    get transactions() {
        return this.getTxsByAddress()
    }

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
    }

    // get address details and txs
    async updateData(params: ITransactionParams) {
        this.loading = true
        this.txLoading = true

        if (this.assetsLoaded) {
            this.fetchTx(params)
            await this.getAddressDetails_X()
        }
    }

    async getAddressDetails_X() {
        if (this.assetsLoaded === true) {
            try {
                this.metadata = await getAddress(this.addressID, this.assetsMap)
                this.loading = false
                if (!this.metadata) {
                    const nullData: IAddress = {
                        address: this.addressID,
                        publicKey: '',
                        // P-Chain AVAX balance
                        AVAX_balance: Big(0),
                        P_unlocked: Big(0),
                        P_lockedStakeable: Big(0),
                        P_lockedNotStakeable: Big(0),
                        P_staked: Big(0),
                        P_utxoIDs: [],
                        // X-Chain AVAX balance
                        X_unlocked: Big(0),
                        X_locked: Big(0),
                        // X-Chain Assets
                        totalTransactionCount: 0,
                        totalUtxoCount: 0,
                        assets: [],
                    }
                    this.metadata = nullData
                }
            } catch (err) {
                this.loading = false
                if (err.response) {
                    console.log(err.response)
                    this.requestError = true
                    this.requestErrorStatus = err.response.status
                    this.requestErrorMessage = err.response.data.message
                } else if (err.request) {
                    console.log(err.request)
                }
            }
        }
    }

    fetchTx(params: ITransactionParams) {
        this.txLoading = true
        this.$store
            .dispatch('Transactions/getTxsByAddress', {
                id: null,
                params: {
                    address: this.addressID,
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
.transactions {
    overflow: auto;
    margin-top: 30px;
    font-size: 12px;

    .v-alert {
        margin: 16px;
        padding: 16px;
        color: $blue;
        font-size: 14px;
    }
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
    border-top: 1px solid #e7e7e7;
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
    .bar-table {
        justify-content: center;
    }

    .transactions {
        .table_headers {
            display: none;
        }
    }
}
</style>
