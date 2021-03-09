<template>
    <div class="utxo_container output_container">
        <div class="utxo_new_col">
            <UtxoSummary :index="$vnode.key" :utxo="utxo"></UtxoSummary>
            <UtxoAddresses
                :addresses="utxo.addresses"
                :type="'output'"
            ></UtxoAddresses>
            <UtxoLockTime :time="utxo.locktime"></UtxoLockTime>
            <UtxoThreshold
                :threshold="utxo.threshold"
                :addresses="utxo.addresses"
            ></UtxoThreshold>
            <!-- P-CHAIN EXTRA INFO -->
            <UtxoStake :is-stake="utxo.stake"></UtxoStake>
            <UtxoStakeable
                :is-stakeableout="utxo.stakeableout"
                :time="utxo.stakeLocktime"
            ></UtxoStakeable>
            <!-- X-CHAIN EXTRA INFO -->
            <div v-if="utxo.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <UtxoNFTPayload
                :payload="utxo.payload"
                :asset-i-d="utxo.assetID"
                :group-i-d="utxo.groupID"
            ></UtxoNFTPayload>
            <!-- C-CHAIN EXTRA INFO -->
            <UtxoBlock :block="utxo.block" :nonce="utxo.nonce"></UtxoBlock>
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
import UtxoTxLinkOutput from '@/components/Transaction/UtxoTxLinkOutput.vue'
import UtxoLockTime from '@/components/Transaction/UtxoLockTime.vue'
import UtxoThreshold from '@/components/Transaction/UtxoThreshold.vue'
import UtxoAddresses from '@/components/Transaction/UtxoAddresses.vue'
import UtxoStake from '@/components/Transaction/UtxoStake.vue'
import UtxoStakeable from '@/components/Transaction/UtxoStakeable.vue'
import UtxoBlock from '@/components/Transaction/UtxoBlock.vue'
import UtxoNFTPayload from '@/components/Transaction/UtxoNFTPayload.vue'
import UtxoSummary from '@/components/Transaction/UtxoSummary.vue'

@Component({
    components: {
        UtxoTxLinkOutput,
        UtxoLockTime,
        UtxoThreshold,
        UtxoAddresses,
        UtxoStake,
        UtxoStakeable,
        UtxoBlock,
        UtxoNFTPayload,
        UtxoSummary,
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
}
</script>

<style scoped lang="scss"></style>
