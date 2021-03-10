<template>
    <div class="utxo_col">
        <div class="utxo_label">
            <span class="index">#{{ index }} </span>
            <span class="type">{{ utxo.outputType | getOutputType }}</span>
            <span v-if="isMint" class="type minted">Minted</span>
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

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoSummary extends Vue {
    @Prop() index!: number
    @Prop() utxo!: Output
    @Prop() isMint?: boolean

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
