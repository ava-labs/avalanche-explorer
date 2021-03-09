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
            <UtxoSummary :index="$vnode.key" :utxo="utxo.output"></UtxoSummary>
            <UtxoAddresses
                :addresses="utxo.output.addresses"
                :type="'input'"
            ></UtxoAddresses>
            <UtxoCredentials :credentials="utxo.credentials"> </UtxoCredentials>
            <UtxoLockTime :time="utxo.output.locktime"></UtxoLockTime>
            <UtxoThreshold
                :threshold="utxo.output.threshold"
                :addresses="utxo.output.addresses"
            ></UtxoThreshold>
            <!-- P-CHAIN EXTRA INFO -->
            <UtxoStake :is-stake="utxo.output.stake"></UtxoStake>
            <UtxoStakeable
                :is-stakeableout="utxo.output.stakeableout"
                :time="utxo.output.stakeLocktime"
            ></UtxoStakeable>
            <!-- X-CHAIN EXTRA INFO -->
            <div v-if="utxo.output.genesisutxo === true">
                <div>UTXO is from genesis</div>
            </div>
            <UtxoNFTPayload
                :payload="utxo.output.payload"
                :asset-i-d="utxo.output.assetID"
                :group-i-d="utxo.output.groupID"
            ></UtxoNFTPayload>
            <!-- C-CHAIN EXTRA INFO -->
            <UtxoBlock
                :block="utxo.output.block"
                :nonce="utxo.output.nonce"
            ></UtxoBlock>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Input } from '@/store/modules/transactions/models'
import { getOutputType } from '@/services/transactions'
import UtxoTxLinkInput from '@/components/Transaction/UtxoTxLinkInput.vue'
import UtxoLockTime from '@/components/Transaction/UtxoLockTime.vue'
import UtxoThreshold from '@/components/Transaction/UtxoThreshold.vue'
import UtxoAddresses from '@/components/Transaction/UtxoAddresses.vue'
import UtxoStake from '@/components/Transaction/UtxoStake.vue'
import UtxoStakeable from '@/components/Transaction/UtxoStakeable.vue'
import UtxoBlock from '@/components/Transaction/UtxoBlock.vue'
import UtxoNFTPayload from '@/components/Transaction/UtxoNFTPayload.vue'
import UtxoCredentials from '@/components/Transaction/UtxoCredentials.vue'
import UtxoSummary from '@/components/Transaction/UtxoSummary.vue'

@Component({
    components: {
        UtxoTxLinkInput,
        UtxoLockTime,
        UtxoThreshold,
        UtxoAddresses,
        UtxoStake,
        UtxoStakeable,
        UtxoBlock,
        UtxoNFTPayload,
        UtxoCredentials,
        UtxoSummary,
    },
    filters: {
        getOutputType,
    },
})
export default class UtxoRowInput extends Vue {
    @Prop() utxo!: Input
}
</script>

<style scoped lang="scss"></style>
