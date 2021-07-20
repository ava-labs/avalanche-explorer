<template>
    <div v-if="tx" class="card meta">
        <header class="header">
            <p class="evm_tx_type_label">
                <slot></slot>
            </p>
            <h2>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p class="click_to_copy">
                            <span class="tx_hash" @click="copy" v-on="on">
                                Transaction Detail
                            </span>
                        </p>
                    </template>
                    <span>Click to copy</span>
                </v-tooltip>
            </h2>
        </header>
        <div id="evm_tx_tabs">
            <v-tabs v-model="tab" show-arrows>
                <!-- TABS -->
                <v-tab href="#overview">Overview</v-tab>
                <v-tab v-if="hasTraces" href="#traces"
                    >Traces ({{ tx.traces.length }})</v-tab
                >
                <v-tab v-if="hasTransfers" href="#transfers"
                    >Transfers (TBD)</v-tab
                >
                <v-tab v-if="hasLogs" href="#logs"
                    >Events ({{ tx.logs.length }})</v-tab
                >
                <!-- TAB ITEMS -->
                <v-tab-item class="tab_content" value="overview">
                    <EVMMetadata :tx="tx" />
                </v-tab-item>
                <v-tab-item v-if="hasTraces" class="tab_content" value="traces">
                    <EVMExecutionTrace :traces="tx.tracesGraph" />
                </v-tab-item>
                <v-tab-item
                    v-if="hasTransfers"
                    class="tab_content"
                    value="transfers"
                >
                </v-tab-item>
                <v-tab-item v-if="hasLogs" class="tab_content" value="logs">
                    <EVMLogRow
                        v-for="log in tx.logs"
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
import { getMappingForType } from '@/store/modules/transactions/maps'
import { toAVAX } from '@/helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import EVMMetadata from '@/components/Transaction/EVMMetadata.vue'
import EVMExecutionTrace from '@/components/Transaction/EVMExecutionTrace.vue'
import EVMLogRow from '@/components/rows/EVMLogRow.vue'

@Component({
    components: {
        Tooltip,
        CopyText,
        EVMMetadata,
        EVMExecutionTrace,
        EVMLogRow,
    },
    filters: {
        getType: getMappingForType,
        toAVAX,
    },
})
export default class EVMTxSummary extends Vue {
    @Prop() tx!: any

    copy() {
        navigator.clipboard.writeText(this.tx.id)
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

    get hasTraces() {
        return this.tx.traces.length > 0 ? true : false
    }

    get hasTransfers() {
        return this.tx.transfers.length > 0 ? true : false
    }

    get hasLogs() {
        return this.tx.logs.length > 0 ? true : false
    }
}
</script>

<style scoped lang="scss">
.evm_tx_type_label {
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
    .tx_type_label {
        margin-bottom: 20px;
    }
}
</style>
<style lang="scss">
#evm_tx_tabs {
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
