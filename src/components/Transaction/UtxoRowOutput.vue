<template>
    <div class="utxo_container output_container">
        <div class="utxo_new_col">
            <Summary :index="$vnode.key" :utxo="utxo"></Summary>
            <Addresses :addresses="utxo.addresses" :type="'output'"></Addresses>
            <LockTime :time="utxo.locktime"></LockTime>
            <Threshold
                :threshold="utxo.threshold"
                :addresses="utxo.addresses"
            ></Threshold>
            <!-- P-CHAIN -->
            <Stake :is-stake="utxo.stake"></Stake>
            <Stakeable
                :is-stakeableout="utxo.stakeableout"
                :time="utxo.stakeLocktime"
            ></Stakeable>
            <!-- X-CHAIN -->
            <div v-if="utxo.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <NFTPayload
                :payload="utxo.payload"
                :asset-i-d="utxo.assetID"
                :group-i-d="utxo.groupID"
            ></NFTPayload>
            <!-- C-CHAIN -->
            <Block :block="utxo.block" :nonce="utxo.nonce"></Block>
        </div>
        <div class="tx_link">
            <TxLinkOutput
                :tx-i-d="utxo.redeemingTransactionID"
                :chain-i-d="utxo.chainID"
                :timestamp="utxo.timestamp"
            >
            </TxLinkOutput>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import TxLinkOutput from '@/components/Transaction/UtxoTxLinkOutput.vue'
import LockTime from '@/components/Transaction/UtxoLockTime.vue'
import Threshold from '@/components/Transaction/UtxoThreshold.vue'
import Addresses from '@/components/Transaction/UtxoAddresses.vue'
import Stake from '@/components/Transaction/UtxoStake.vue'
import Stakeable from '@/components/Transaction/UtxoStakeable.vue'
import Block from '@/components/Transaction/UtxoBlock.vue'
import NFTPayload from '@/components/Transaction/UtxoNFTPayload.vue'
import Summary from '@/components/Transaction/UtxoSummary.vue'

@Component({
    components: {
        TxLinkOutput,
        LockTime,
        Threshold,
        Addresses,
        Stake,
        Stakeable,
        Block,
        NFTPayload,
        Summary,
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
