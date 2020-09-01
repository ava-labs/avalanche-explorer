<template>
    <div class="to_amount">
        <div class="info_col">
            <div class="to" v-for="(addr,i) in addresses" :key="i">
                <span class="label" v-if="$vuetify.breakpoint.smAndDown">To</span>
                <router-link class="addr" :to="`/address/X-`+addr">{{addr | address}}</router-link>
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

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { addressMap, trimmedLocaleString } from "@/helper";
import { ITransactionOutput } from '@/js/ITransaction';
import { Asset } from '@/js/Asset';
import Big from "big.js";

@Component({
    filters: {
        address(val: string) {
            let value = val;
            if (value.indexOf("-") === 1) {
                value = value.substring(2, value.length);
            }
            return addressMap(value);
        }
    }
})

export default class OutputUtxo extends Vue {
    @Prop() output!: ITransactionOutput;
    
    get asset(): Asset {
        if (this.$store.state.assets[this.output.assetID]) {
            return this.$store.state.assets[this.output.assetID]
        }
        this.$store.dispatch("addUnknownAsset", this.output.assetID);        
        //@ts-ignore
        return {
            id: "",
            alias: "",
            chainID: "",
            currentSupply: Big(0),
            denomination: 1,
            name: "",
            symbol: "",
            profane: false,
        }
    }

    get addresses(): string[] {
        return this.output.addresses;
    }
    
    get amount(): string {
        let amt = Big(this.output.amount); 
        return trimmedLocaleString(amt, this.asset.denomination);
    }
}
</script>

<style scoped lang="scss">
@use '../../../main';
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

    .label {
        font-weight: 400; /* 700 */
        width: 25px;
        padding: 6px 6px 4px 10px;
        opacity: 0.5;
        font-size: 10px;
        text-align: right;
    }

    .addr {
        text-overflow: ellipsis;
        overflow: hidden;
        padding-left: 0;
        text-decoration: none;
        max-width: 250px;

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
    background-color: main.$secondary-color-xlight;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
}
.amount {
    color: main.$secondary-color;
    font-weight: 400;
    letter-spacing: 0.1em;
    font-size: 11px;

    span {
        font-weight: 700;
    }
}

@include main.device_xs {
    .info_col {
        padding: 0 10px 0 0;
    }
}
</style>
