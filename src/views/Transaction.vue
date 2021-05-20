<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <template v-if="loading">
            <Loader
                :content-id="txId"
                :message="'Fetching Transaction Details'"
            />
        </template>
        <template v-else>
            <HTTPError
                v-if="!tx"
                :id="txId"
                :title="'Transaction Details Not Found'"
                :message="'A record for this transaction ID was not found in the Avalanche Explorer'"
                :support-u-r-l="'https://chat.avalabs.org'"
            />
            <template v-else>
                <TransactionSummary :tx="tx">
                    {{ tx.type | getType }} Transaction
                </TransactionSummary>
                <TransactionUTXO :tx="tx" />
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import TransactionSummary from '@/components/Transaction/TransactionSummary.vue'
import TransactionUTXO from '@/components/TransactionUTXO.vue'
import HTTPError from '@/components/misc/HTTPError.vue'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import { getMappingForType } from '@/store/modules/transactions/maps'

@Component({
    components: {
        Loader,
        TransactionSummary,
        TransactionUTXO,
        HTTPError,
    },
    filters: {
        getType: getMappingForType,
    },
})
export default class TransactionPage extends Mixins(TransactionsGettersMixin) {
    loading = false
    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Transactions',
            disabled: false,
            href: '/tx',
        },
        {
            text: 'Detail',
            disabled: true,
            href: '',
        },
    ]

    @Watch('txId')
    ontxIdChanged() {
        this.getData()
    }

    @Watch('assetsLoaded')
    onAssetsLoaded() {
        this.getData()
    }

    created() {
        this.getData()
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    get txId(): string {
        return this.$route.params.id
    }

    get tx() {
        return this.getTx()
    }

    getData(): void {
        this.loading = true
        if (this.assetsLoaded) {
            this.$store
                .dispatch('Transactions/getTx', {
                    id: this.txId,
                })
                .then(() => {
                    this.loading = false
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
}
</script>

<style scoped lang="scss">
.tx_details_error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    h2 {
        font-weight: 400;
        font-size: 36px;
        line-height: 1.25em;
    }

    .message {
        margin: 12px 0 0.5em;
        font-size: 16px;
        color: $primary-color;
    }

    .content_id {
        font-size: 16px;
        color: $primary-color-light;
    }

    a {
        display: block;
        width: max-content;
        text-decoration: none !important;
        margin-top: 30px;
        transition: opacity 0.3s;

        background-color: transparent !important;
        color: $secondary-color !important;
        padding: 10px 24px;

        border-radius: 6px;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase !important;
        font-size: 14px;

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
