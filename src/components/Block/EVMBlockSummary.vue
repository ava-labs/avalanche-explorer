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
                                {{ block.blockNumber }}
                            </span>
                        </p>
                    </template>
                    <span>Click to copy</span>
                </v-tooltip>
            </h2>
        </header>
        <EVMMetadata :block="block" />
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import { toAVAX } from '@/helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import EVMMetadata from '@/components/Block/EVMMetadata.vue'
import { EVMBlockQueryResponse } from '@/store/modules/blocks'

@Component({
    components: {
        Tooltip,
        CopyText,
        EVMMetadata,
    },
    filters: {
        toAVAX,
    },
})
export default class EVMTxSummary extends Vue {
    @Prop() block!: EVMBlockQueryResponse

    copy() {
        navigator.clipboard.writeText(this.block.blockNumber)
        this.$store.dispatch('Notifications/add', {
            title: 'Copied',
            message: 'Copied to clipoard.',
        })
    }
}
</script>

<style scoped lang="scss">
.block_type_label {
    margin-bottom: 20px;
}

@include smOrSmaller {
    .block_type_label {
        margin-bottom: 20px;
    }
}
</style>
