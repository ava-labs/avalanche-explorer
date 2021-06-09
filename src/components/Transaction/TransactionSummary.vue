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
                                {{ tx.id }}
                            </span>
                        </p>
                    </template>
                    <span>Click to copy</span>
                </v-tooltip>
            </h2>
        </header>
        <Metadata :tx="tx" :is-staking="isStaking" :is-memo="isMemo" />
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import UtxoRow from '@/components/Transaction/UtxoRow.vue'
import { Transaction } from '@/js/Transaction'
import { getMappingForType } from '@/store/modules/transactions/maps'
import { toAVAX } from '@/helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import Metadata from '@/components/Transaction/Metadata.vue'

@Component({
    components: {
        UtxoRow,
        Tooltip,
        CopyText,

        Metadata,
    },
    filters: {
        getType: getMappingForType,
        toAVAX,
    },
})
export default class TransactionSummary extends Vue {
    @Prop() tx!: Transaction

    get isMemo(): boolean {
        return this.tx.memo === '' || null ? false : true
    }

    get isAssetGenesis(): boolean {
        return this.tx.type === 'create_asset'
    }

    get isStaking() {
        return this.tx.type === 'add_validator' ||
            this.tx.type === 'add_delegator'
            ? true
            : false
    }

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
.decode {
    display: inline-block;
    color: $primary-color-light;
    width: 60px;
    font-size: 12px;
}

.tx_type_label {
    margin-bottom: 20px;
}

@include smOrSmaller {
    .tx_type_label {
        margin-bottom: 20px;
    }
}
</style>
