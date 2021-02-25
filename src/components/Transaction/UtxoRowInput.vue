<template>
    <div class="utxo_container">
        <!-- TX LINK -->
        <div class="tx_link">
            <!-- CONDITIONAL FOR C-CHAIN -->
            <router-link v-if="txId !== '-'" :to="`/tx/${txId}`">
                <v-tooltip right>
                    <template v-slot:activator="{ on }">
                        <fa v-on="on" icon="arrow-left" color="#2196f3"></fa>
                    </template>
                    <div>
                        <p>Input UTXO generated in TX ID:</p>
                        <p>{{ txId }}</p>
                    </div>
                </v-tooltip>
            </router-link>
        </div>
        <!-- CONTENT -->
        <div class="utxo_new_col">
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
                        class="address monospace"
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
