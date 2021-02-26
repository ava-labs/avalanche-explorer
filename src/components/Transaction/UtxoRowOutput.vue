<template>
    <div class="utxo_container output_container">
        <div class="utxo_new_col">
            <!-- TYPE/AMOUNT -->
            <div class="utxo_col">
                <div class="utxo_label">
                    <span class="index">#{{ $vnode.key }} - </span>
                    <span class="type">{{
                        utxo.outputType | getOutputType
                    }}</span>
                </div>
                <div>
                    <span class="amount monospace">{{ amount }}</span>
                    <span class="symbol">{{ symbol }}</span>
                </div>
            </div>
            <!-- ADDRESSES -->
            <div>
                <div class="utxo_label">To</div>
                <div>
                    <!-- CONDITIONAL FOR C-CHAIN -->
                    <router-link
                        v-for="(
                            { address, displayAddress }, i
                        ) in utxo.addresses"
                        :key="i"
                        :to="`/address/X-${address}`"
                        class="address monospace"
                        >{{ displayAddress }}</router-link
                    >
                </div>
            </div>
            <!-- EXTRA INFO -->
            <div v-if="utxo.locktime !== 0">
                <div class="utxo_label">Signature</div>
                <div>{{ utxo.locktime }}</div>
            </div>
            <div v-if="utxo.threshold > 1">
                <div class="utxo_label">Threshold</div>
                <div>{{ utxo.threshold }}</div>
            </div>
        </div>
        <div class="tx_link">
            <UtxoTxLinkOutput
                :txID="utxo.redeemingTransactionID"
                :chainID="utxo.chainID"
                :timestamp="utxo.timestamp"
            >
            </UtxoTxLinkOutput>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITransactionOutput } from '@/store/modules/transactions/models.ts'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'
import UtxoTxLinkOutput from '@/components/Transaction/UtxoTxLinkOutput.vue'

@Component({
    components: {
        UtxoTxLinkOutput,
    },
    filters: {
        getOutputType,
    },
})
export default class UtxoRowOutput extends Vue {
    @Prop() utxo!: ITransactionOutput
    @Prop() type!: string

    get amount(): string {
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

    get txId(): string {
        // C-CHAIN CONDITIONAL
        const redeemingID = this.utxo.redeemingTransactionID
        return redeemingID === null || redeemingID === '' ? '-' : redeemingID
    }
}
</script>

<style scoped lang="scss"></style>
