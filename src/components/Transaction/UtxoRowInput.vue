<template>
    <div class="utxo_container">
        <!-- TX LINK -->
        <div class="tx_link">
            <span class="force-ellipsis">
                <!-- CONDITIONAL FOR C-CHAIN -->
                <router-link v-if="txId !== '-'" :to="`/tx/${txId}`">
                    <fa icon="arrow-left"></fa
                ></router-link>
            </span>
        </div>
        <!-- CONTENT -->
        <div class="utxo_new_col">
            <div class="utxo_new_row utxo_col">
                <div class="index type">
                    <span>#{{ $vnode.key }} - </span>
                    <span>{{ utxo.outputType | getOutputType }}</span>
                </div>
                <div>
                    <span class="amount monospace">{{ amount }}</span>
                    <span class="symbol">{{ symbol }}</span>
                </div>
            </div>
            <!-- ADDRESS(-ES) -->
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
                        class="monospace"
                        >{{ displayAddress }}</router-link
                    >
                </div>
            </div>
            <!-- CREDENTIAL(-S) -->
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

            <!-- EXTRA ROW IF NECESSARY -->
            <!-- SIGNATURE GOES HERE -->
            <!-- <p>{{ utxo.locktime }}</p> -->
            <!-- <p>{{ utxo.threshold }}</p> -->
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITransactionOutput } from '@/store/modules/transactions/models.ts'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoRowInput extends Vue {
    @Prop() utxo!: ITransactionOutput
    @Prop() type!: string

    get asset(): Asset {
        return this.$store.state.assets[this.utxo.assetID]
    }

    get symbol(): string {
        return this.asset ? this.asset.symbol : this.utxo.assetID
    }

    get amount(): string {
        const denomination = this.asset ? this.asset.denomination : 0
        return this.utxo.amount
            .div(Math.pow(10, denomination))
            .toLocaleString(denomination)
    }

    get txId(): string {
        const redeemingID = this.utxo.redeemingTransactionID

        return this.type === 'output'
            ? redeemingID === null || redeemingID === ''
                ? '-'
                : redeemingID
            : redeemingID === null || redeemingID === ''
            ? '-'
            : this.utxo.transactionID
    }

    get redeemed(): boolean {
        const redeemingID = this.utxo.redeemingTransactionID

        return this.type === 'output'
            ? redeemingID === null || redeemingID === ''
                ? false
                : true
            : redeemingID === null || redeemingID === ''
            ? false
            : false
    }
}
</script>

<style scoped lang="scss"></style>
