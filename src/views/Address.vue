<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Loader
            v-if="loading && !requestError"
            :content-id="addressID"
            :message="'Fetching Address Details'"
        />
        <AddressSummary
            v-if="metadata && !requestError && assetsLoaded === true"
            :meta-data="metadata"
            :address-i-d="addressID"
            :alias="alias"
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
import AddressSummary from '@/components/Address/AddressSummary.vue'
import AddressDict from '@/known_addresses'
import { IBalanceX, IAddress } from '@/services/addresses/models'
import { getAddress } from '@/services/addresses/addresses.service'
import HTTPError from '@/components/misc/HTTPError.vue'
import TxHeader from '@/components/Transaction/TxHeader.vue'
import TxInteractive from '@/components/Transaction/TxInteractive.vue'
import { ITransactionParams } from '@/services/transactions'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import { P, X, C } from '@/known_blockchains'
import { getNullAddress } from '@/helper'

@Component({
    components: {
        Loader,
        Tooltip,
        HTTPError,
        AddressSummary,
        TxHeader,
        TxInteractive,
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
        return this.metadata ? this.metadata.X_assets : []
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

    setFilter(val: string[]) {
        this.filters = val
    }

    get chains() {
        return [P, X, C]
    }

    get transactions() {
        return this.getTxsByAddress()
    }

    // get address details and txs
    async updateData(params: ITransactionParams) {
        this.loading = true
        this.txLoading = true

        if (this.assetsLoaded) {
            this.fetchTx(params)
            await this.getAddressDetails()
        }
    }

    async getAddressDetails() {
        if (this.assetsLoaded === true) {
            try {
                this.metadata = await getAddress(this.addressID, this.assetsMap)
                // console.log('this.metadata', this.metadata)
                this.loading = false
                if (!this.metadata) {
                    this.metadata = getNullAddress(this.addressID)
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
