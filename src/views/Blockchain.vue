<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <Loader
            v-if="loading && !subnetsLoaded"
            :content-id="id"
            :message="'Fetching Blockchain Details'"
        />
        <template v-else>
            <Metadata :blockchain="blockchain" />
            <template v-if="blockchain">
                <div v-if="blockchain.indexed" class="card blockchain_tx">
                    <div class="header">
                        <TransactionsHeader />
                        <TxParams @change="fetchTx" />
                    </div>
                    <div class="two-col">
                        <template v-if="chain">
                            <TxFilter :chains="[chain]" @change="setFilter"
                        /></template>
                        <div class="right">
                            <template v-if="!loading && assetsLoaded">
                                <TxTableHead />
                                <v-alert
                                    v-if="filteredTransactions.length === 0"
                                    color="#e6f5ff"
                                    dense
                                >
                                    There are no matching entries
                                </v-alert>
                                <div class="rows">
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
import Metadata from '@/components/Blockchain/Metadata.vue'
import { TransactionsGettersMixin } from '@/store/modules/transactions/transactions.mixins'
import { ITransactionParams } from '@/services/transactions'
import TransactionsHeader from '@/components/Transaction/TxHeader.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import TxFilter from '@/components/Transaction/TxFilter.vue'
import TxParams from '@/components/Transaction/TxParams.vue'
import DateForm from '@/components/misc/DateForm.vue'
import { ChainMap, getTxChainType } from '@/known_blockchains'

@Component({
    components: {
        Loader,
        Metadata,
        TransactionsHeader,
        TxTableHead,
        TxRow,
        DateForm,
        TxFilter,
        TxParams,
    },
})
export default class BlockchainPage extends Mixins(TransactionsGettersMixin) {
    loading = true
    blockchain: Blockchain | null = null
    filters: string[] = []

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
        this.fetchTx({
            sort: 'timestamp-desc',
            limit: 25,
        })
    }

    @Watch('subnetsLoaded')
    async onSubnetsLoadedChanged() {
        await this.getData()
        this.fetchTx({
            sort: 'timestamp-desc',
            limit: 25,
        })
    }

    @Watch('assetsLoaded')
    async onAssetsLoadedChanged() {
        await this.getData()
        this.fetchTx({
            sort: 'timestamp-desc',
            limit: 25,
        })
    }

    setFilter(val: string[]) {
        this.filters = val
    }

    get id(): string {
        return this.$route.params.id
    }

    get chain() {
        return getTxChainType(this.id) as ChainMap
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

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
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
