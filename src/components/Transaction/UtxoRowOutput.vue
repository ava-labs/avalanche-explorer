<template>
    <div
        class="utxo_container output_container"
        :style="{ backgroundColor: background }"
    >
        <div class="utxo_new_col">
            <Summary
                :index="$vnode.key"
                :utxo="utxo"
                :is-mint="isMint"
                :is-p-v-m-export="isPVMExport"
                :is-export="isExport"
                :is-atomic-export="isAtomicExport"
            />
            <Addresses :addresses="utxo.addresses" :type="'output'" />
            <LockTime :time="utxo.locktime" />
            <Threshold
                :threshold="utxo.threshold"
                :addresses="utxo.addresses"
            />
            <!-- P-CHAIN -->
            <Stake :is-stake="utxo.stake" />
            <Stakeable
                :is-stakeableout="utxo.stakeableout"
                :time="utxo.stakeLocktime"
            />
            <!-- X-CHAIN -->
            <div v-if="utxo.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <NFTPayload
                :payload="utxo.payload"
                :asset-i-d="utxo.assetID"
                :group-i-d="utxo.groupID"
            />
            <!-- C-CHAIN -->
            <Block :block="utxo.block" :nonce="utxo.nonce" />
        </div>
        <div class="tx_link">
            <TxLinkOutput
                :tx-i-d="utxo.redeemingTransactionID"
                :chain-i-d="utxo.chainID"
                :timestamp="utxo.timestamp"
            />
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
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
import { AVAX_ID } from '@/known_assets'
import { P, X, C } from '@/known_blockchains'
import { backgroundColor } from '@/helper'

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
    @Prop() utxo!: any
    @Prop() type!: string
    @Prop() txtype!: string

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

    get isMint() {
        return this.txtype === 'create_asset' && this.utxo.assetID !== AVAX_ID
            ? true
            : false
    }

    // Exporting UTXO from P to Atomic DB
    get isPVMExport() {
        return this.txtype === 'pvm_export' && this.utxo.chainID !== P.id
            ? true
            : false
    }

    // Exporting UTXO from X to Atomic DB
    get isExport() {
        return this.txtype === 'export' && this.utxo.chainID !== X.id
            ? true
            : false
    }

    // Exporting UTXO from C to Atomic DB
    get isAtomicExport() {
        return this.txtype === 'atomic_export_tx' && this.utxo.chainID !== C.id
            ? true
            : false
    }

    get background(): string {
        return backgroundColor(this.utxo.addresses[0].displayAddress)
    }
}
</script>

<style scoped lang="scss"></style>
