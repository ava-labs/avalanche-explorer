<template>
    <div class="utxo_container">
        <div class="tx_link">
            <UtxoTxLinkInput
                :txID="utxo.transactionID"
                :chainID="utxo.chainID"
                :timestamp="utxo.timestamp"
            >
            </UtxoTxLinkInput>
        </div>
        <!-- CONTENT -->
        <div class="utxo_new_col">
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
                <div class="utxo_label">From</div>
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
            <!-- CREDENTIALS -->
            <div>
                <div class="utxo_label">Signature</div>
                <div>
                    <router-link
                        v-for="(credential, i) in utxo.credentials"
                        :key="i"
                        class="monospace"
                        >{{ credential.signature }}</router-link
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
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITransactionOutput } from '@/store/modules/transactions/models.ts'
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
    @Prop() utxo!: ITransactionOutput

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
}
</script>

<style scoped lang="scss"></style>
