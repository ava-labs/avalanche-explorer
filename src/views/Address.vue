<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Loader
            v-if="loading && !requestError"
            :content-id="addressID"
            :message="'Fetching Address Details'"
        ></Loader>
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
        ></Metadata>
        <HTTPError
            v-if="!loading && requestError"
            :id="addressID"
            :title="'There was an error fetching address details.'"
            :status="requestErrorStatus"
            :message="requestErrorMessage"
            :support-u-r-l="'https://chat.avalabs.org'"
        >
        </HTTPError>

        <!-- TRANSACTIONS -->
        <section v-if="!loading && !txRequestError" class="card transactions">
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
                    <template v-if="txloading && !assetsLoaded">
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
                        <v-alert
                            v-if="transactions.length === 0"
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
        >
        </HTTPError>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
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
import { ITransaction } from '@/store/modules/transactions/models'
import { CCHAINID, PCHAINID, XCHAINID } from '@/known_blockchains'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'
import DateForm from '@/components/misc/DateForm.vue'

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
export default class AddressPage extends Vue {
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
    totalTx = 0
    offset = 0
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

    async created() {
        this.updateData()
    }

    @Watch('address')
    onAddressChanged() {
        this.updateData()
    }

    @Watch('assetsLoaded')
    onAssetsLoaded() {
        this.updateData()
    }

    @Watch('$route')
    onRouteChanged() {
        this.updateData()
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

    setStart(val: string) {
        this.startDate = val
    }

    setEnd(val: string) {
        this.endDate = val
    }

    get transactions(): ITransaction[] {
        return this.$store.state.Transactions.addressTxRes.transactions
    }

    get filters() {
        return this.selection.map((val) => val.id)
    }

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
    }

    // get address details and txs
    async updateData() {
        this.loading = true
        this.txLoading = true

        if (this.assetsLoaded) {
            this.getTx()
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

    getTx() {
        this.txLoading = true
        // TODO: support service for multiple chains
        this.$store
            .dispatch('Transactions/getTxsByAddress', {
                id: null,
                params: {
                    address: this.addressID,
                    sort: this.sort,
                    offset: this.offset,
                    limit: this.limit,
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
    .bar {
        flex-direction: column;
        align-items: stretch;

        .pagination-container {
            padding-top: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

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
