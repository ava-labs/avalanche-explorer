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
            <UtxoAddresses :addresses="utxo.addresses"></UtxoAddresses>
            <!-- EXTRA INFO -->
            <UtxoLockTime :time="utxo.locktime"></UtxoLockTime>
            <UtxoThreshold
                :threshold="utxo.threshold"
                :addresses="utxo.addresses"
            ></UtxoThreshold>
            <!-- P-CHAIN EXTRA INFO -->
            <div v-if="utxo.frozen === true">
                <!-- TODO: Apricot -->
                <div>UTXO is frozen</div>
            </div>

            <div v-if="utxo.stake === true">
                <div>UTXO was in the staking output set</div>
            </div>

            <div v-if="utxo.stakeableout === true">
                <div>UTXO is Stakeable</div>
                <!-- additional layer on top of secp transfer output - connected to stakeLocktime -->
            </div>
            <div v-if="utxo.stakeLocktime > 0">
                <!-- relevant to 'Add Validator' and 'Add Delegator' txs -->
                <div>Convert this to time: {{ utxo.stakeLocktime }}</div>
            </div>

            <!-- X-CHAIN EXTRA INFO -->
            <div v-if="utxo.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <div>
                <!-- ADD WALLET UTXO COMPONENT -->
                <!-- payload: string | null // relevant to NFTs -->
            </div>
            <!-- C-CHAIN EXTRA INFO -->
            <div v-if="utxo.block">
                <div class="utxo_label">Block</div>
                <div>{{ utxo.block }}</div>
                <!-- block: string // https://cchain.explorer.avax.network/blocks/33726/transactions - broken block/tx -->
            </div>
            <div v-if="utxo.nonce > 0">
                <div class="utxo_label">Nonce</div>
                <div>nonce: {{ utxo.nonce }}</div>
            </div>
        </div>
        <div class="tx_link">
            <UtxoTxLinkOutput
                :tx-i-d="utxo.redeemingTransactionID"
                :chain-i-d="utxo.chainID"
                :timestamp="utxo.timestamp"
            >
            </UtxoTxLinkOutput>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'
import UtxoTxLinkOutput from '@/components/Transaction/UtxoTxLinkOutput.vue'
import UtxoLockTime from '@/components/Transaction/UtxoLockTime.vue'
import UtxoThreshold from '@/components/Transaction/UtxoThreshold.vue'
import UtxoAddresses from '@/components/Transaction/UtxoAddresses.vue'

@Component({
    components: {
        UtxoTxLinkOutput,
        UtxoLockTime,
        UtxoThreshold,
        UtxoAddresses,
    },
    filters: {
        getOutputType,
    },
})
export default class UtxoRowOutput extends Vue {
    @Prop() utxo!: Output
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
