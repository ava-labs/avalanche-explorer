<template>
    <div class="token_row">
        <p v-if="token.symbol" class="symbol">{{token.symbol}}</p>
        <p v-else class="no_symbol"></p>
        <p class="name">{{token.name}}</p>
        <router-link class="id" :to="`/tx/${token.id}`">{{token.id}}</router-link>
        <p class="chain">{{token.chainID | blockchain}}</p>
        <p class="denomination">{{token.denomination}}</p>
        <p class="supply">{{supply}} <span>{{token.symbol}}</span></p>
    </div>
</template>
<script>
import { stringToBig } from "../../helper";
import { blockchainMap } from "@/helper";

export default {
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    filters: {
        blockchain(val) {
            return blockchainMap(val);
        },
    },
    computed: {
        supply() {
            return stringToBig(
                this.token.currentSupply,
                this.token.denomination
            ).toFixed(this.token.denomination);
        }
    }
};
</script>
<style scoped lang="scss">
@use '../../main';

.token_row {
    > * {
        align-self: center;
    }

    > div {
        display: flex;
    }

    p {
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
    }
}

.symbol {
    color: #976cfa;
    background-color: #ebe4fb;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
}

.no_symbol {
    color: transparent;
    background-color: transparent;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
}

.name {
    opacity: 0.7;
}

.denomination {
    text-align: right;
}

.id {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    text-decoration: none;
}

.data_col {
    display: flex;
    flex-direction: column;
}

.supply {
    text-align: right;
    span {
        display: inline-block;
        width: 43px;
        font-size: 14px;
        opacity: 0.4;
    }
}

@include main.device_sm {
    .symbol {
        padding: 2px;
    }

    .name {
        grid-column: 2/4;
    }

    .supply {
        grid-column: 1/4;
        text-align: right;
    }
}
</style>
