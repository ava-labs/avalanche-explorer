<template>
    <div class="utxo_row">
        <router-link :to="`/tx/${txId}`" v-if="type==='input'">{{txId}}</router-link>
        <p v-else>-</p>

        <p>{{utxo.locktime}}</p>
        <p>{{utxo.threshold}}</p>
        <div>
            <router-link v-for="(addr, i) in utxo.addresses"
                         :to="`/address/${addr}`"
                         :key="i">
                {{addr}}
            </router-link>
        </div>
        <div class="col_amount">
            <p class="amount_symbol">{{amount}} <b>{{asset.symbol}}</b></p>
        </div>
    </div>
</template>
<script>
    import Big from "big.js";
    import {stringToBig} from "../../helper";

    export default {
        props: {
            utxo: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                required: true
            }
        },
        computed:{
            amount(){
                let asset = this.asset;
                let res = stringToBig(this.utxo.amount, asset.denomination);
                // let res = Big(this.utxo.amount).div(Math.pow(10,asset.denomination));
                return res.toFixed(asset.denomination);
            },
            asset(){
                let assets = this.$store.state.assets;
                let id = this.utxo.assetID;

                let res = assets[id];
                return res;
            },
            txId(){
                if(this.utxo.redeemingTransactionID === null){
                    return '-';
                }
                return this.utxo.transactionID;
            }
        }
    }
</script>
<style scoped lang="scss">
    .utxo_row{
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 120px 140px 140px 120px 1fr;

        > * {
            align-self: center;
        }
    }

    a{
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .col_amount{
        display: flex;
        flex-direction: row-reverse;
    }

    .amount_symbol{
        white-space: nowrap;
        width: max-content;
        background-color: #E6F5FF;
        color: #71C5FF;
        padding: 4px 8px;
        border-radius: 3px;
    }
</style>
