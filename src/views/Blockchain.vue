<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <Loader
            v-if="loading && !subnetsLoaded"
            :content-id="id"
            :message="'Fetching Blockchain Details'"
        />
        <template v-else>
            <BlockchainSummary :blockchain="blockchain" />
            <!-- TRANSACTIONS -->
            <template v-if="blockchain">
                <div v-if="blockchain.indexed" class="card blockchain_tx">
                    <TxHeader />
                    <TxInteractive
                        :transactions="transactions"
                        :assets-loaded="assetsLoaded"
                        :loading="loading"
                        :chains="chain"
                        @change="fetchTx"
                    />
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component, Watch } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import Blockchain from '@/js/Blockchain'
import BlockchainSummary from '@/components/Blockchain/BlockchainSummary.vue'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import { ITransactionParams } from '@/services/transactions'
import TxHeader from '@/components/Transaction/TxHeader.vue'
import TxInteractive from '@/components/Transaction/TxInteractive.vue'
import { ChainMap, getTxChainType } from '@/known_blockchains'

@Component({
    components: {
        Loader,
        BlockchainSummary,
        TxHeader,
        TxInteractive,
    },
})
export default class BlockchainPage extends Mixins(TransactionsGettersMixin) {
    loading = true
    blockchain: Blockchain | null = null
    filters: string[] = []
    initialParams = {
        sort: 'timestamp-desc',
        limit: 25,
    }

    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Blockchains',
            disabled: false,
            href: '/blockchains',
        },
    ]

    async created() {
        await this.getData()
        this.fetchTx(this.initialParams)
    }

    @Watch('subnetsLoaded')
    async onSubnetsLoadedChanged() {
        await this.getData()
        this.fetchTx(this.initialParams)
    }

    @Watch('assetsLoaded')
    async onAssetsLoadedChanged() {
        await this.getData()
        this.fetchTx(this.initialParams)
    }

    get id(): string {
        return this.$route.params.id
    }

    get chain() {
        return [getTxChainType(this.id) as ChainMap]
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    get subnetsLoaded() {
        return this.$store.state.Platform.subnetsLoaded
    }

    async getData() {
        const blockchains = this.$store.state.Platform.blockchains
        this.blockchain = blockchains.find((b: Blockchain) => b.id === this.id)
        this.loading = false
    }

    get transactions() {
        return this.getTxsByBlockchain()
    }

    fetchTx(params: ITransactionParams): void {
        this.loading = true
        if (this.assetsLoaded) {
            this.$store
                .dispatch('Transactions/getTxsByBlockchain', {
                    id: null,
                    params: {
                        chainID: [this.id],
                        ...params,
                    },
                })
                .then(() => (this.loading = false))
        }
    }
}
</script>

<style scoped lang="scss">
.blockchain_tx {
    margin-top: 30px;
}
</style>
