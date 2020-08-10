<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">{{symbol}}</p>
        </div>
        <div class="data">
            <p class="id">{{name}}</p>
            <p class="supply">Supply {{supply.toFixed(2)}} {{symbol}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { stringToBig } from "@/helper";

@Component({})
export default class AssetResult extends Vue {
    @Prop() item!: any;
    
    get id() {
        return this.item.id;
    }

    get name() {
        return this.item.name;
    }

    get symbol() {
        return this.item.symbol;
    }

    get supply() {
        return stringToBig(this.item.currentSupply, this.item.denomination);
    }
    
    select() {
        let url = `/asset/${this.id}`;
        this.$router.push(url);
        this.$emit("select");
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

.symbol {
    padding: 0;
    background-color: main.$primary-color-light !important;
    color: main.$primary-color;
    border-radius: 6px;
    font-weight: 500; /* 700 */
    font-size: 11px;
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
}

.id {
    color: main.$primary-color;
}

.supply {
    margin-top: 4px;
    opacity: 0.7;
}
</style>
