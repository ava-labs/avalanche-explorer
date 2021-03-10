<template>
    <div class="utxo_col">
        <div class="utxo_label">
            <span class="index">#{{ index }} </span>
            <span class="type">{{ utxo.outputType | getOutputType }}</span>
            <span v-if="isMint" class="type minted">Minted</span>
            <span v-if="isExport" class="tag">Exported to {{ chain }}</span>
        </div>
        <div>
            <span v-if="amount" class="amount monospace">{{ amount }}</span>
            <span class="symbol">{{ symbol }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getTxChainType } from '@/store/modules/transactions/maps'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoSummary extends Vue {
    @Prop() index!: number
    @Prop() utxo!: Output
    @Prop() isMint?: boolean
    @Prop() isExport?: boolean

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
}
</script>

<style scoped lang="scss">
.utxo_label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
</style>
