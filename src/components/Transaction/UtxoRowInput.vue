<template>
    <div
        class="utxo_container input_container"
        :style="{ backgroundColor: background }"
    >
        <div class="tx_link">
            <TxLinkInput
                :tx-i-d="utxo.output.transactionID"
                :chain-i-d="utxo.output.chainID"
                :timestamp="utxo.output.timestamp"
            />
        </div>
        <div class="utxo_new_col">
            <Summary
                :index="$vnode.key"
                :utxo="utxo.output"
                :is-p-v-m-import="isPVMImport"
                :is-import="isImport"
                :is-atomic-import="isAtomicImport"
            />
            <Addresses :addresses="utxo.output.addresses" :type="'input'" />
            <Credentials :credentials="utxo.credentials" />
            <LockTime :time="utxo.output.locktime" />
            <Threshold
                :threshold="utxo.output.threshold"
                :addresses="utxo.output.addresses"
            />
            <!-- P-CHAIN -->
            <Stake :is-stake="utxo.output.stake" />
            <Stakeable
                :is-stakeableout="utxo.output.stakeableout"
                :time="utxo.output.stakeLocktime"
            />
            <!-- X-CHAIN -->
            <div v-if="utxo.output.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <NFTPayload
                :payload="utxo.output.payload"
                :asset-i-d="utxo.output.assetID"
                :group-i-d="utxo.output.groupID"
            />
            <!-- C-CHAIN -->
            <Block :block="utxo.output.block" :nonce="utxo.output.nonce" />
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TxLinkInput from '@/components/Transaction/UtxoTxLinkInput.vue'
import LockTime from '@/components/Transaction/UtxoLockTime.vue'
import Threshold from '@/components/Transaction/UtxoThreshold.vue'
import Addresses from '@/components/Transaction/UtxoAddresses.vue'
import Stake from '@/components/Transaction/UtxoStake.vue'
import Stakeable from '@/components/Transaction/UtxoStakeable.vue'
import Block from '@/components/Transaction/UtxoBlock.vue'
import NFTPayload from '@/components/Transaction/UtxoNFTPayload.vue'
import Credentials from '@/components/Transaction/UtxoCredentials.vue'
import Summary from '@/components/Transaction/UtxoSummary.vue'
import { backgroundColor } from '@/helper'

@Component({
    components: {
        TxLinkInput,
        LockTime,
        Threshold,
        Addresses,
        Stake,
        Stakeable,
        Block,
        NFTPayload,
        Credentials,
        Summary,
    },
})
export default class UtxoRowInput extends Vue {
    @Prop() utxo!: any
    @Prop() txtype!: string

    // Importing UTXO from Atomic DB to P
    get isPVMImport() {
        return this.txtype === 'pvm_import' ? true : false
    }

    // Importing UTXO from Atomic DB to X
    get isImport() {
        return this.txtype === 'import' ? true : false
    }

    // Importing UTXO from Atomic DB to C
    get isAtomicImport() {
        return this.txtype === 'atomic_import_tx' ? true : false
    }

    get background(): string {
        return backgroundColor(this.utxo.output.addresses[0].displayAddress)
    }
}
</script>

<style scoped lang="scss"></style>
