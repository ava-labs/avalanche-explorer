<template>
    <div class="utxo_row">
        <!-- Tx -->
        <span v-if="txId !== '-'" class="force-ellipsis">
            <router-link :to="`/tx/${txId}`">{{ txId }}</router-link>
        </span>
        <p v-else>-</p>
        <!-- Metrics -->
        <p class="redeemed">
            <fa v-if="redeemed" icon="check-circle"></fa>
        </p>
        <p>{{ utxo.locktime }}</p>
        <p>{{ utxo.threshold }}</p>
        <!-- From/To -->
        <span class="force-ellipsis">
            <router-link
                v-for="({ address, displayAddress }, i) in utxo.addresses"
                :key="i"
                :to="`/address/X-${address}`"
                >{{ displayAddress }}</router-link
            >
        </span>
        <div class="type">
            {{ utxo.outputType | getOutputType }}
        </div>
        <!-- Amount -->
        <div class="col_amount">
            <p class="amount_symbol">
                {{ amount }}
                <b>{{ symbol }}</b>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoRow extends Vue {
    @Prop() utxo!: Output
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

<style scoped lang="scss">
.utxo_row {
    display: grid;
    grid-gap: 10px;

    > * {
        align-self: center;
    }
}

.redeemed {
    color: $green;
}

.col_amount {
    display: flex;
    flex-direction: row-reverse;
}

.amount_symbol {
    white-space: nowrap;
    width: max-content;
    background-color: $secondary-color-xlight;
    color: $secondary-color;
    padding: 4px 8px;
    border-radius: 3px;
}

.type {
    color: var(--grey-300);
}
</style>
