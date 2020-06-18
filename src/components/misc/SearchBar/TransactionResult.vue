<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">Tx</p>
        </div>
        <div class="data">
            <p class="id">{{tx.id}}</p>
            <p class="ago">{{tx.data.timestamp | date}}</p>
        </div>
    </div>
</template>

<script>
import { Transaction } from "@/js/Transaction";
import moment from "moment";

export default {
    data() {
        return {
            tx: null,
            addresses: []
        };
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    filters: {
        date(val) {
            let date = new Date(val);
            return moment(date).fromNow();
        }
    },
    methods: {
        select() {
            let url = `/tx/${this.tx.id}`;
            this.$router.push(url);
            this.$emit("select");
        }
    },
    created() {
        this.tx = new Transaction(this.item);
        this.addresses = this.tx.getInputAddresses();
    }
};
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
    font-weight: bold;
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
}

.ago {
    margin-top: 4px;
    opacity: 0.7;
}
</style>
