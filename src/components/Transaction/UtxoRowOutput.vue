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
            <UtxoAddresses
                :addresses="utxo.addresses"
                :type="'output'"
            ></UtxoAddresses>
            <!-- EXTRA INFO -->
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
            <div v-if="payload">
                <div class="utxo_label">Payload</div>
                <NftPayloadView
                    :payload="payload"
                    :small="true"
                ></NftPayloadView>
                {{ payload }}
            </div>
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
import { getOutputType } from '@/services/transactions'
import UtxoTxLinkOutput from '@/components/Transaction/UtxoTxLinkOutput.vue'
import UtxoLockTime from '@/components/Transaction/UtxoLockTime.vue'
import UtxoThreshold from '@/components/Transaction/UtxoThreshold.vue'
import UtxoAddresses from '@/components/Transaction/UtxoAddresses.vue'
import UtxoStake from '@/components/Transaction/UtxoStake.vue'
import UtxoStakeable from '@/components/Transaction/UtxoStakeable.vue'
import UtxoBlock from '@/components/Transaction/UtxoBlock.vue'
import NftPayloadView from '@/components/misc/NftPayloadView/NftPayloadView.vue'
import { pushPayload } from '@/helper'

@Component({
    components: {
        UtxoTxLinkOutput,
        UtxoLockTime,
        UtxoThreshold,
        UtxoAddresses,
        UtxoStake,
        UtxoStakeable,
        UtxoBlock,
        NftPayloadView,
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

    get payload() {
        if (!this.utxo.payload) return undefined
        const payload = pushPayload(
            this.utxo.payload as string,
            this.utxo.assetID,
            this.utxo.groupID
        )
        return (payload as any)[this.utxo.groupID][0]
    }
}
</script>

<style scoped lang="scss"></style>
