<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">Tx</p>
        </div>
        <div class="data">
            <p class="id">{{tx.id}}</p>
            <p class="ago">{{tx.timestamp | date}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Transaction } from "@/js/Transaction";
import moment from "moment";

@Component({
    filters: {
        date(val: string) {
            let date = new Date(val);
            return moment(date).fromNow();
        }
    },
})
export default class TransactionResult extends Vue {
    tx: Transaction | null = null;
    addresses: string[] = [];

    @Prop() item!: any;
    
    created() {
        this.tx = new Transaction(this.item);
        this.addresses = this.tx.getInputAddresses();
    }

    select() {
        if (this.tx) {
            let url = `/tx/${this.tx.id}`;
            this.$router.push(url);
            this.$emit("select");
        }
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
    background-color: main.$white;
    border-radius: 20px;
    border: 2px solid main.$black;
    font-weight: 500; /* 700 */
    font-size: 11px;
    height: 38px;
    width: 38px;
    line-height: 38px;
    text-align: center;
}

.id {
    color: main.$primary-color;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 700;
}

.ago {
    margin-top: 4px;
    opacity: 0.7;
}
</style>
