<template>
    <div class="utxo_container input_container">
        <div class="tx_link">
            <UtxoTxLinkInput
                :tx-i-d="utxo.output.transactionID"
                :chain-i-d="utxo.output.chainID"
                :timestamp="utxo.output.timestamp"
            >
            </UtxoTxLinkInput>
        </div>
        <div class="utxo_new_col">
            <!-- TYPE/AMOUNT -->
            <div class="utxo_col">
                <div class="utxo_label">
                    <span class="index">#{{ $vnode.key }} - </span>
                    <span class="type">{{
                        utxo.output.outputType | getOutputType
                    }}</span>
                </div>
                <div>
                    <span class="amount monospace">{{ amount }}</span>
                    <span class="symbol">{{ symbol }}</span>
                </div>
            </div>
            <!-- ADDRESSES -->
            <div>
                <div class="utxo_label">From</div>
                <div>
                    <!-- CONDITIONAL FOR C-CHAIN -->
                    <router-link
                        v-for="({ address, displayAddress }, i) in utxo.output
                            .addresses"
                        :key="i"
                        :to="`/address/X-${address}`"
                        class="address monospace"
                        >{{ displayAddress }}</router-link
                    >
                </div>
            </div>
            <!-- CREDENTIALS -->
            <div>
                <div class="utxo_label">Signature</div>
                <p
                    v-for="(credential, i) in utxo.credentials"
                    :key="i"
                    class="monospace signature"
                >
                    {{ credential.signature }}>
                </p>
            </div>
            <!-- EXTRA INFO -->
            <div v-if="utxo.output.locktime !== 0">
                <div class="utxo_label">Lock Time</div>
                <div>{{ utxo.output.locktime }}</div>
            </div>
            <div v-if="utxo.output.threshold > 1">
                <div class="utxo_label">Threshold</div>
                <div>{{ utxo.output.threshold }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Input } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'
import UtxoTxLinkInput from '@/components/Transaction/UtxoTxLinkInput.vue'

@Component({
    components: {
        UtxoTxLinkInput,
    },
    filters: {
        getOutputType,
    },
})
export default class UtxoRowInput extends Vue {
    @Prop() utxo!: Input

    get amount(): string {
        const denomination = this.asset ? this.asset.denomination : 0
        return this.utxo.output.amount
            .div(Math.pow(10, denomination))
            .toLocaleString(denomination)
    }

    get asset(): Asset {
        return this.$store.state.assets[this.utxo.output.assetID]
    }

    get symbol(): string {
        return this.asset ? this.asset.symbol : this.utxo.output.assetID
    }
}
</script>

<style scoped lang="scss"></style>
