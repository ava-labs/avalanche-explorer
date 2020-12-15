<template>
    <div class="utxo_row">
        <!-- Tx -->
        <router-link :to="`/tx/${txId}`" v-if="txId !== '-'">{{
            txId
        }}</router-link>
        <p v-else>-</p>
        <!-- Metrics -->
        <p class="redeemed">
            <fa icon="check-circle" v-if="redeemed"></fa>
        </p>
        <p>{{ utxo.locktime }}</p>
        <p>{{ utxo.threshold }}</p>
        <!-- From/To -->
        <div>
            <router-link
                v-for="(addr, i) in utxo.addresses"
                :to="`/address/X-${addr}`"
                :key="i"
                >{{ addr | address }}</router-link
            >
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
import { addressMap } from '../../helper'
import { ITransactionOutput } from '../../js/ITransaction'
import { Asset } from '@/js/Asset'

@Component({
    filters: {
        address(val: string): string {
            return addressMap(val)
        },
    },
})
export default class UtxoRow extends Vue {
    @Prop() utxo!: ITransactionOutput
    @Prop() type!: string

    get asset(): Asset {
        return this.$store.state.assets[this.utxo.assetID]
    }

    get symbol(): string {
        return this.asset ? this.asset.symbol : this.utxo.assetID
    }

    get amount(): string {
        let denomination = this.asset ? this.asset.denomination : 0
        return this.utxo.amount
            .div(Math.pow(10, denomination))
            .toLocaleString(denomination)
    }

    get txId(): string {
        let redeemingID = this.utxo.redeemingTransactionID

        return this.type === 'output'
            ? redeemingID === null || redeemingID === ''
                ? '-'
                : redeemingID
            : redeemingID === null || redeemingID === ''
            ? '-'
            : this.utxo.transactionID
    }

    get redeemed(): boolean {
        let redeemingID = this.utxo.redeemingTransactionID

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

a {
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
</style>
