<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">Address</p>
        </div>
        <div class="data">
            <p class="id">{{chainNow}}-{{item.address}}</p>
            <p class="balance">
                Balance
                <span>{{avaxBalance}} {{avaxSymbol}}</span>
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { stringToBig } from "@/helper";

@Component({})
export default class AddressResult extends Vue {
    @Prop() item!: any | null;
    
    select() {
        // TODO: support for multiple chains. add a chain param
        let url = `/address/X-${this.item.address}`;
        this.$router.push(url);
        this.$emit("select");
    }

    get avaxBalance() {
        return this.item.assets["21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"].balance;
    }
    
    get avaxSymbol() {
        return this.$store.state.assets["21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"].symbol;
    }
    
    get numTx() {
        return this.item.transactionCount;
    }
    
    // TODO: support for multiple chains. add a chain param
    get chainNow() {
        return this.$store.state.chainId;
    }
}
</script>
<style scoped lang="scss">
@use"../../../main";

.symbol_container {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

$symbol_W: 40px;

.symbol {
    padding: 0;
    border-radius: 6px;
    font-weight: 500; /* 700 */
    font-size: 9px;
    height: $symbol_W;
    width: $symbol_W;
    text-align: center;
    line-height: $symbol_W;
}

.id {
    color: main.$primary-color;
}

.balance {
    padding-top: 4px;
    opacity: 0.7;
}
</style>
