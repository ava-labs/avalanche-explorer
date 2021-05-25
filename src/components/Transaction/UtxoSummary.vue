<template>
    <div class="utxo_col">
        <div class="utxo_label">
            <span class="index">#{{ index }} </span>
            <span
                v-if="utxo.outputType !== 7"
                class="type tag"
                :style="{ color: foreground }"
                >{{ utxo.outputType | getOutputType }}</span
            >
            <span
                v-if="isMint"
                class="type tag minted"
                :style="{ color: foreground }"
                >Minted</span
            >
            <span
                v-if="isPVMExport || isExport || isAtomicExport"
                class="tag"
                :style="{ color: foreground }"
                >Exported to Atomic Memory</span
            >
            <span
                v-if="isPVMImport || isImport || isAtomicImport"
                class="tag"
                :style="{ color: foreground }"
                >Imported from Atomic Memory</span
            >
        </div>
        <div>
            <span v-if="amount" class="amount monospace">{{ amount }}</span>
            <span class="symbol">
                <router-link
                    :to="`/asset/${utxo.assetID}`"
                    class="asset_link"
                    >{{ symbol }}</router-link
                >
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getTxChainType } from '@/known_blockchains'
import { foregroundColor } from '@/helper'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoSummary extends Vue {
    @Prop() index!: number
    @Prop() utxo!: Output
    @Prop() isMint?: boolean
    @Prop() isPVMImport?: boolean
    @Prop() isImport?: boolean
    @Prop() isAtomicImport?: boolean
    @Prop() isPVMExport?: boolean
    @Prop() isExport?: boolean
    @Prop() isAtomicExport?: boolean

    get amount(): string | null {
        if (this.utxo.outputType === 10 || this.utxo.outputType === 11)
            return null

        const denomination = this.asset ? this.asset.denomination : 0
        return this.utxo.amount
            .div(Math.pow(10, denomination))
            .toLocaleString(denomination)
    }

    get asset(): Asset {
        return this.$store.state.assets[this.utxo.assetID]
    }

    get symbol(): string {
        return this.asset ? this.asset.symbol : this.utxo.assetID
    }

    get chain(): string {
        return getTxChainType(this.utxo.chainID)!.name
    }

    get foreground(): string {
        return foregroundColor(this.chain)
    }
}
</script>

<style scoped lang="scss">
.utxo_label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.detail {
    a.asset_link {
        display: inline;

        &:hover {
            opacity: 0.7;
            text-decoration: none;
        }
    }
}
</style>
