<template>
    <div class="search_result" @click="select">
        <p class="symbol">{{symbol}}</p>
        <div class="data">
            <p class="id">{{name}}</p>
            <p class="supply">Supply {{supply.toFixed(2)}} {{symbol}}</p>
        </div>
    </div>
</template>

<script>
import { stringToBig } from "@/helper";

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        id() {
            return this.item.id;
        },
        name() {
            return this.item.name;
        },
        symbol() {
            return this.item.symbol;
        },
        supply() {
            let res = stringToBig(
                this.item.currentSupply,
                this.item.denomination
            );
            return res;
        },
        createdAt() {
            return new Date(this.item.timestamp);
        }
    },
    methods: {
        select() {
            let url = `/tx/${this.id}`;
            this.$router.push(url);
            this.$emit("select");
        }
    }
};
</script>

<style scoped lang="scss">
@use '../../../main';
.id {
    color: main.$primary-color;
}
</style>
