<template>
    <div class="to_amount">
        <div class="info_col">
            <div class="to" v-for="(addr,i) in addresses" :key="i">
                <router-link class="addr ava-monospace" :to="`/address/`+addr">{{addr | address}}</router-link>
            </div>
        </div>
        <div class="info_col" style="padding-right: 0;">
            <div class="amount_col to">
                <p class="amount">
                    {{amount}}
                    <span>{{asset.symbol}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Big from "big.js";
import { addressMap } from "@/helper";

export default {
    filters: {
        address(val) {
            return addressMap(val);
        }
    },
    props: {
        output: {
            type: Object,
            required: true
        }
    },
    computed: {
        asset() {
            let id = this.output.assetID;
            return this.$store.state.assets[id];
        },
        addresses() {
            return this.output.addresses;
        },
        amount() {
            let amt = Big(this.output.amount);

            let denom = Math.min(this.asset.denomination, 2);
            return amt
                .div(Math.pow(10, this.asset.denomination))
                .toFixed(denom);
        }
    }
};
</script>

<style scoped lang="scss">
.to_amount {
    display: grid;
    grid-template-columns: 1fr max-content;
}

.info_col {
    padding: 0px 10px;
    overflow: auto;
}

.to {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    white-space: nowrap;
    overflow: hidden;

    .addr {
        text-overflow: ellipsis;
        overflow: hidden;
        padding-left: 0;
        color: #7a838e !important;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
    
    p, a {
        padding: 4px 12px;
    }
}

.amount_col {
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    background-color: #e6f5ff;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
}
.amount {
    /*position: absolute;*/
    /*top: 5px;*/
    /*right: 5px;*/
    font-weight: bold;
    letter-spacing: 0.1em;
    font-size: 11px;
    color: #71c5ff;
}
</style>
