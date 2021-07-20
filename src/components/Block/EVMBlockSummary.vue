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
                <!-- TABS -->
                <v-tab href="#overview">Overview</v-tab>
                <v-tab v-if="hasTxs" href="#transactions"
                    >Transactions ({{ block.transactions.length }})</v-tab
                >
                <v-tab v-if="hasAtomicTxs" href="#atomic-transactions"
                    >Atomic Transactions ({{
                        block.atomicTransactions.length
                    }})</v-tab
                >
                <v-tab v-if="hasLogs" href="#logs"
                    >Events ({{ block.logs.length }})</v-tab
                >
                <!-- TAB ITEMS -->
                <v-tab-item class="tab_content" value="overview">
                    <EVMMetadata :block="block" />
                </v-tab-item>
                <v-tab-item
                    v-if="hasTxs"
                    class="tab_content"
                    value="transactions"
                >
                    <EVMTxDataTable :transactions="block.transactions" />
                </v-tab-item>
                <v-tab-item
                    v-if="hasAtomicTxs"
                    class="tab_content"
                    value="atomic-transactions"
                >
                    <TxList :transactions="block.atomicTransactions" />
                </v-tab-item>
                <v-tab-item v-if="hasLogs" class="tab_content" value="logs">
                    <EVMLogRow
                        v-for="log in block.logs"
                        :key="log.logIndex"
                        :log="log"
                    />
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

    get hasTxs() {
        return this.block.transactions.length > 0 ? true : false
    }

    get hasAtomicTxs() {
        return this.block.atomicTransactions.length > 0 ? true : false
    }

    get hasLogs() {
        return this.block.logs.length > 0 ? true : false
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
