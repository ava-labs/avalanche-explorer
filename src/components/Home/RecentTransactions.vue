<template>
    <div class="recent_tx">
        <RecentTxHeader
            heading="Recent Transactions"
            :loading="loading"
            @update="updateTx"
        ></RecentTxHeader>
        <!-- TABLE -->
        <div class="list">
            <TxTableHead></TxTableHead>
            <transition-group v-if="transactions.length > 0" name="fade">
                <tx-row
                    v-for="tx in transactions"
                    :key="tx.id"
                    class="recent_tx_rows"
                    :transaction="tx"
                ></tx-row>
            </transition-group>
            <!-- LOAD -->
            <div v-if="transactions.length === 0">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import { ITransaction } from '@/services/transactions/models.ts'
import RecentTxHeader from '@/components/Transaction/RecentTxHeader.vue'

@Component({
    components: {
        Tooltip,
        TxTableHead,
        TxRow,
        RecentTxHeader,
    },
})
export default class RecentTransactions extends Vue {
    loading = false
    limit = 25
    poller = 0
    sort = 'timestamp-desc'

    created() {
        this.poller = window.setInterval(() => this.pollForTxUpdates(), 5000)
        /**
         * In case you need to kill the interval while developing, to apply styles live or whatever
         * window.dispatchEvent(new CustomEvent('TRANSACTION_POLLING:KILL'))
         */
        window.addEventListener(
            'TRANSACTION_POLLING:KILL',
            this.killPollingInterval.bind(this)
        )
    }

    private killPollingInterval() {
        window.clearInterval(this.poller)
    }

    destroyed() {
        this.killPollingInterval()
        window.removeEventListener(
            'TRANSACTION_POLLING:KILL',
            this.killPollingInterval.bind(this)
        )
    }

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get transactions(): ITransaction[] {
        return this.$store.state.recentTxRes.transactions
    }

    async updateTx(): Promise<void> {
        this.loading = true
        if (this.assetsLoaded) {
            // TODO: support service for multiple chains
            await this.$store.dispatch('getTransactions', {
                mutation: 'addRecentTransactions',
                id: null,
                params: {
                    sort: this.sort,
                    limit: this.limit,
                },
            })
            this.loading = false
        }
    }

    pollForTxUpdates(): void {
        this.$store.dispatch('getTransactions', {
            mutation: 'addRecentTransactions',
            id: null,
            params: {
                sort: this.sort,
                limit: this.limit,
            },
        })
    }
}
</script>

<style scoped lang="scss">
.refresh {
    margin-left: 16px;
}

.recent_tx_rows {
    width: 100%;
    font-size: 12px;
    border-radius: 2px;
    margin-bottom: 2px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

@include smOnly {
    .table_headers {
        display: none;
    }

    .list {
        padding: 0;
    }
}
</style>
