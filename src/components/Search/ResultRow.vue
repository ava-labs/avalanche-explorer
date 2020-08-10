<template>
    <address-row v-if="type==='address'" :address="result.data"></address-row>
    <tx-row v-else-if="type==='transaction'" :transaction="result.data"></tx-row>
    <asset-row v-else-if="type==='asset'" :asset="result.data"></asset-row>
    <!--    <utxo-row v-else :utxo="result.data"></utxo-row>-->
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import TxRow from "../rows/TxRow/TxRow.vue";
import AssetRow from "../rows/AssetRow.vue";
import AddressRow from "../rows/AddressRow.vue";
// import UtxoRow from "../rows/UtxoRow.vue";

@Component({
    components: {
        AddressRow,
        TxRow,
        AssetRow
        // UtxoRow
    }
}) 

export default class ResultRow extends Vue {
    @Prop() query!: string;
    @Prop() result!: any;
    
    get rowType() {
        switch (this.type) {
            case "address":
                return AddressRow;
        }
        return null;
    }

    get type() {
        return this.result.type;
    }

    get typeSymbol() {
        if (this.type === "address") {
            return "#";
        }
        return "Tx";
    }

    get txCount() {
        return this.result.Data.transactionCount;
    }

    get balance() {
        return this.result.Data.balance;
    }

    get lifetimeValue() {
        return this.result.Data.lifetimeValue;
    }

    get url() {
        if (this.type === "address") {
            return `/address/${this.query}`;
        }
        return "/";
    }

    get tx_id() {
        return this.result.Data.id;
    }
    
    get tx_timestamp() {
        let stamp = this.result.Data.timestamp;
        return stamp;
    }
    
}
</script>

<style scoped lang="scss">
$symbol_w: 35px;

.symbol {
    text-align: center;
    line-height: $symbol_w;
    background-color: #f1f2f3;
    color: #000;
    font-size: 14px;
    font-weight: 400; /* 700 */
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.link {
    text-decoration: none;
    text-transform: capitalize;
}

.center_info {
    display: flex;
    flex-grow: 1;

    > div {
        text-align: center;
        padding-left: 30px;
    }

    .label {
        font-size: 12px;
        opacity: 0.7;
        font-weight: lighter;
        margin-bottom: 6px;
    }
}
</style>
