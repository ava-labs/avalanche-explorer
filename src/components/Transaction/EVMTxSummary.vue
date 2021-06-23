<template>
    <div v-if="tx" class="card meta">
        <header class="header">
            <p class="tx_type_label">
                <slot></slot>
            </p>
            <h2>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p class="click_to_copy">
                            <span class="tx_hash" @click="copy" v-on="on">
                                {{ tx.hash }}
                            </span>
                        </p>
                    </template>
                    <span>Click to copy</span>
                </v-tooltip>
            </h2>
        </header>
        <!-- <Metadata :tx="tx" :is-staking="isStaking" :is-memo="isMemo" /> -->
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import { Transaction } from '@/js/Transaction'
import { getMappingForType } from '@/store/modules/transactions/maps'
import { toAVAX } from '@/helper'
import Tooltip from '@/components/rows/Tooltip.vue'
// import Metadata from '@/components/Transaction/Metadata.vue'

@Component({
    components: {
        Tooltip,
        CopyText,
        // Metadata,
    },
    filters: {
        getType: getMappingForType,
        toAVAX,
    },
})
export default class EVMTxSummary extends Vue {
    @Prop() tx!: Transaction

    copy() {
        navigator.clipboard.writeText(this.tx.id)
        this.$store.dispatch('Notifications/add', {
            title: 'Copied',
            message: 'Copied to clipoard.',
        })
    }
}
</script>

<style scoped lang="scss">
.tx_type_label {
    margin-bottom: 20px;
}

@include smOrSmaller {
    .tx_type_label {
        margin-bottom: 20px;
    }
}
</style>
