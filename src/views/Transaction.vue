<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="loading">
            <Loader
                :content-id="txId"
                :message="'Fetching Transaction Details'"
            ></Loader>
        </template>
        <template v-else>
            <HTTPError
                v-if="!tx"
                :id="txId"
                :title="'Transaction Details Not Found'"
                :message="'A record for this transaction ID was not found in the Avalanche Explorer'"
                :support-u-r-l="'https://chat.avalabs.org'"
            >
            </HTTPError>
            <template v-else>
                <TransactionDetailCard :tx="tx">
                    Transaction Details
                </TransactionDetailCard>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import TransactionDetailCard from '@/components/TransactionDetailCard.vue'
import HTTPError from '@/components/misc/HTTPError.vue'
import { Transaction } from '../js/Transaction'
import api from '../axios'

@Component({
    components: {
        Loader,
        TransactionDetailCard,
        HTTPError,
    },
})
export default class TransactionPage extends Vue {
    loading = false
    tx: Transaction | null = null
    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Transaction',
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

    getData(): void {
        this.loading = true

        // TODO: support service for multiple chains
        const url = `/x/transactions/${this.txId}`
        if (this.assetsLoaded) {
            api.get(url)
                .then((res) => {
                    this.loading = false
                    if (res.data) {
                        // tx in Ortelius
                        this.tx = new Transaction(res.data)
                    }
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
        font-weight: 400; /* 700 */
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
        font-family: 'DM Sans', sans-serif;
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
