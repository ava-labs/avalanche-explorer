<template>
    <div v-if="block" class="card meta">
        <header class="header">
            <p class="block_type_label">
                <slot></slot>
            </p>
            <h2>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p class="click_to_copy">
                            <span class="block_hash" @click="copy" v-on="on">
                                {{ block.number }}
                            </span>
                        </p>
                    </template>
                    <span>Click to copy</span>
                </v-tooltip>
            </h2>
        </header>
        <div id="block_tabs">
            <v-tabs v-model="tab" show-arrows>
                <v-tab href="#overview">Overview</v-tab>
                <v-tab href="#transactions">Transactions</v-tab>
                <v-tab href="#atomic-transactions">Atomic Transactions</v-tab>
                <v-tab href="#logs">Event Logs</v-tab>
                <!-- OVERVIEW -->
                <v-tab-item class="tab_content" value="overview">
                    <EVMMetadata :block="block" />
                </v-tab-item>
                <!-- TRANSACTIONS -->
                <v-tab-item class="tab_content" value="transactions">
                    <template v-if="block.transactions.length === 0">
                        <p class="null">
                            There are no transactions for this block.
                        </p>
                    </template>
                    <template v-else>
                        <EVMTxDataTable :transactions="block.transactions" />
                    </template>
                </v-tab-item>
                <!-- ATOMIC TRANSACTIONS -->
                <v-tab-item class="tab_content" value="atomic-transactions">
                    <template v-if="block.atomicTransactions.length === 0">
                        <p class="null">
                            There are no atomic transactions for this block.
                        </p>
                    </template>
                    <template v-else>
                        <TxList :transactions="block.atomicTransactions" />
                    </template>
                </v-tab-item>
                <!-- LOGS -->
                <v-tab-item class="tab_content" value="logs">
                    <template v-if="block.logs.length === 0">
                        <p class="null">There are no logs for this block.</p>
                    </template>
                    <template v-else>
                        <EVMLogRow
                            v-for="log in block.logs"
                            :key="log.logIndex"
                            :log="log"
                        />
                    </template>
                </v-tab-item>
            </v-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import { toAVAX } from '@/helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import EVMMetadata from '@/components/Block/EVMMetadata.vue'
import EVMLogRow from '@/components/rows/EVMLogRow.vue'
import TxList from '@/components/Transaction/TxList.vue'
import EVMTxDataTable from '@/components/Transaction/EVMTxDataTable.vue'

@Component({
    components: {
        Tooltip,
        CopyText,
        EVMMetadata,
        EVMTxDataTable,
        TxList,
        EVMLogRow,
    },
    filters: {
        toAVAX,
    },
})
export default class EVMTxSummary extends Vue {
    @Prop() block!: any

    copy() {
        navigator.clipboard.writeText(this.block.blockNumber)
        this.$store.dispatch('Notifications/add', {
            title: 'Copied',
            message: 'Copied to clipoard.',
        })
    }

    get tab() {
        return this.$route.query.tab
    }

    set tab(tab: string | (string | null)[]) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
    }
}
</script>

<style scoped lang="scss">
.block_type_label {
    margin-bottom: 20px;
}

.detail {
    a {
        overflow: hidden;
        display: flex;
        text-overflow: ellipsis;
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }
}

.tab_content {
    margin-top: 20px;
}

@include smOrSmaller {
    .block_type_label {
        margin-bottom: 20px;
    }
}
</style>
<style lang="scss">
#block_tabs {
    .v-tabs--vertical > .v-tabs-bar {
        max-width: 200px !important;
        border-left: 1px solid #cecece;
    }

    .v-tabs--vertical > .v-window {
        overflow: hidden !important;
    }

    .v-card__text {
        padding-left: 0 !important;
    }

    .v-tab.v-tab {
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        font-weight: 500;
    }
    .v-application .primary--text {
        color: $primary-color !important;
        caret-color: $primary-color !important;
    }

    .v-tabs-slider-wrapper {
        color: $secondary-color;
        caret-color: $secondary-color;
    }
}
</style>
