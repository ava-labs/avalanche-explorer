<template>
    <div class="utxo_container input_container">
        <div class="tx_link">
            <TxLinkInput
                :tx-i-d="utxo.output.transactionID"
                :chain-i-d="utxo.output.chainID"
                :timestamp="utxo.output.timestamp"
            >
            </TxLinkInput>
        </div>
        <div class="utxo_new_col">
            <Summary
                :index="$vnode.key"
                :utxo="utxo.output"
                :is-p-v-m-import="isPVMImport"
                :is-import="isImport"
                :is-atomic-import="isAtomicImport"
            ></Summary>
            <Addresses
                :addresses="utxo.output.addresses"
                :type="'input'"
            ></Addresses>
            <Credentials :credentials="utxo.credentials"></Credentials>
            <LockTime :time="utxo.output.locktime"></LockTime>
            <Threshold
                :threshold="utxo.output.threshold"
                :addresses="utxo.output.addresses"
            ></Threshold>
            <!-- P-CHAIN -->
            <Stake :is-stake="utxo.output.stake"></Stake>
            <Stakeable
                :is-stakeableout="utxo.output.stakeableout"
                :time="utxo.output.stakeLocktime"
            ></Stakeable>
            <!-- X-CHAIN -->
            <div v-if="utxo.output.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <NFTPayload
                :payload="utxo.output.payload"
                :asset-i-d="utxo.output.assetID"
                :group-i-d="utxo.output.groupID"
            ></NFTPayload>
            <!-- C-CHAIN -->
            <Block
                :block="utxo.output.block"
                :nonce="utxo.output.nonce"
            ></Block>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Input } from '@/store/modules/transactions/models'
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
    @Prop() utxo!: Input
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
}
</script>

<style scoped lang="scss"></style>
