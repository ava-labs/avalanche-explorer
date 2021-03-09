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
            <UtxoAddresses
                :addresses="utxo.output.addresses"
                :type="'input'"
            ></UtxoAddresses>
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
            <div>
                <!-- ADD WALLET UTXO COMPONENT -->
                <!-- payload: string | null // relevant to NFTs -->
            </div>
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
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'
import UtxoTxLinkInput from '@/components/Transaction/UtxoTxLinkInput.vue'
import UtxoLockTime from '@/components/Transaction/UtxoLockTime.vue'
import UtxoThreshold from '@/components/Transaction/UtxoThreshold.vue'
import UtxoAddresses from '@/components/Transaction/UtxoAddresses.vue'
import UtxoStake from '@/components/Transaction/UtxoStake.vue'
import UtxoStakeable from '@/components/Transaction/UtxoStakeable.vue'
import UtxoBlock from '@/components/Transaction/UtxoBlock.vue'

@Component({
    components: {
        UtxoTxLinkInput,
        UtxoLockTime,
        UtxoThreshold,
        UtxoAddresses,
        UtxoStake,
        UtxoStakeable,
        UtxoBlock,
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
