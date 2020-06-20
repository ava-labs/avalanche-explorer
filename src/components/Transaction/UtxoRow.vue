<template>
    <div class="utxo_row">
        <router-link :to="`/tx/${txId}`" v-if="type==='input'">{{txId}}</router-link>
        <p v-else>-</p>

        <p>{{utxo.locktime}}</p>
        <p>{{utxo.threshold}}</p>
        <div>
            <router-link
                v-for="(addr, i) in utxo.addresses"
                :to="`/address/${addr}`"
                :key="i"
            >{{addr | address}}</router-link>
        </div>
        <div class="col_amount">
            <p class="amount_symbol">
                {{amount}}
                <b>{{asset.symbol}}</b>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { addressMap } from "../../helper";
import { ITransactionOutput } from "../../js/ITransaction";
import { Asset } from '@/js/Asset';

@Component({
    filters: {
        address(val: string): string {
            return addressMap(val);
        }
    },
})

export default class UtxoRow extends Vue {
    @Prop() utxo!: ITransactionOutput;
    @Prop() type!: string;

    get asset(): Asset {
        return this.$store.state.assets[this.utxo.assetID];
    }

    get amount(): string {
        return this.utxo.amount.toLocaleString(this.asset.denomination);
    }

    get txId(): string {
        return this.utxo.redeemingTransactionID === null
            ? "-"
            : this.utxo.transactionID;
    }
}
</script>

<style scoped lang="scss">
@use "../../main";
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

.col_amount {
    display: flex;
    flex-direction: row-reverse;
}

.amount_symbol {
    white-space: nowrap;
    width: max-content;
    background-color: main.$primary-color-light;
    color: main.$primary-color;
    padding: 4px 8px;
    border-radius: 3px;
}
</style>
