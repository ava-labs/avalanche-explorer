<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Loader
            v-if="loading && !requestError"
            :content-id="addressID"
            :message="'Fetching Address Details'"
        ></Loader>
        <!-- Address Details -->
        <HTTPError
            v-if="!loading && requestError"
            :id="addressID"
            :title="'There was an error fetching address details.'"
            :status="requestErrorStatus"
            :message="requestErrorMessage"
            :support-u-r-l="'https://chat.avalabs.org'"
        >
        </HTTPError>
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

        <!-- Address Txs -->
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

        <!-- TRANSACTIONS -->
        <section v-if="!loading && !txRequestError" class="card transactions">
            <!-- HEADER -->
            <header class="header">
                <TxHeader></TxHeader>
                <!-- LOAD COUNT/PAGINATION -->
                <template v-if="txLoading && !assetsLoaded">
                    <v-progress-circular
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    ></v-progress-circular>
                </template>
                <!-- COUNT/PAGINATION -->
                <template v-else>
                    <div class="bar">
                        <p class="count">
                            <template v-if="!requestError"
                                >{{
                                    totalTransactionCount.toLocaleString()
                                }}
                                transactions found</template
                            >
                        </p>
                        <div class="pagination-container">
                            <pagination-controls
                                ref="paginationTop"
                                :total="totalTransactionCount"
                                :limit="limit"
                                @change="page_change"
                            ></pagination-controls>
                        </div>
                    </div>
                </template>
            </header>

            <!-- TABLE -->
            <TxTableHead></TxTableHead>
            <!-- TBODY LOAD -->
            <div v-show="txLoading">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </div>
            <!-- TBODY -->
            <div v-show="!txLoading">
                <div class="rows">
                    <transition-group name="fade">
                        <tx-row
                            v-for="tx in transactions"
                            :key="tx.id"
                            class="tx_item"
                            :transaction="tx"
                        ></tx-row>
                    </transition-group>
                </div>
                <v-alert v-if="transactions.length === 0" color="#e6f5ff" dense>
                    There are no matching entries
                </v-alert>
                <div class="bar-table">
                    <pagination-controls
                        ref="paginationBottom"
                        :total="totalTransactionCount"
                        :limit="limit"
                        @change="page_change"
                    >
                    </pagination-controls>
                </div>
            </div>
        </section>
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
import PaginationControls from '@/components/misc/PaginationControls.vue'
import api from '../axios'
import AddressDict from '@/known_addresses'
import { Transaction } from '@/js/Transaction'
import { IBalanceX, IAddress } from '@/services/addresses/models'
import { getAddress } from '@/services/addresses/addresses.service'
import Big from 'big.js'
import HTTPError from '@/components/misc/HTTPError.vue'
import TxHeader from '@/components/Transaction/TxHeader.vue'

@Component({
    components: {
        Loader,
        Tooltip,
        HTTPError,
        Metadata,
        TxTableHead,
        TxRow,
        PaginationControls,
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
    transactions: Transaction[] = []
    // tx pagination
    totalTx = 0
    limit = 25 // how many to display
    offset = 0
    sort = 'timestamp-desc'

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

        // Get txs by address
        // TODO: support service for multiple chains
        const url = `/x/transactions?address=${this.addressID}&sort=${this.sort}&offset=${this.offset}&limit=${this.limit}`

        api.get(url)
            .then((res) => {
                this.txLoading = false
                this.transactions = res.data.transactions
            })
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

    page_change(val: number) {
        this.offset = val
        this.getTx()
        const pgNum = Math.floor(this.offset / this.limit) + 1
        // @ts-ignore
        this.$refs.paginationTop.setPage(pgNum)
        // @ts-ignore
        this.$refs.paginationBottom.setPage(pgNum)
    }
}
</script>

<style scoped lang="scss">
/* ==========================================
   transactions
   ========================================== */

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.transactions {
    overflow: auto;
    margin-top: 30px;

    .v-alert {
        margin: 16px;
        padding: 16px;
        color: $blue;
        font-size: 14px;
    }
}

.bar-table {
    border-top: 1px solid #e7e7e7;
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
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
