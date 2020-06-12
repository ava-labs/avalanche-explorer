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
                {{addr | address}}
            </router-link>
        </div>
        <div class="col_amount">
            <p class="amount_symbol">{{amount}} <b>{{asset.symbol}}</b></p>
        </div>
    </div>
</template>
<script>
    import {addressMap, stringToBig} from "../../helper";

    export default {
        filters: {
            address(val){
                return addressMap(val);
            }
        },
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
@use '../../main';
    .utxo_row{
        display: grid;
        grid-gap: 10px;
        /*grid-template-columns: minmax(0,1fr) 1fr 1fr minmax(0,1fr) 1fr;*/

        > * {
            align-self: center;
        }
    }

    a{
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .col_amount{
        display: flex;
        flex-direction: row-reverse;
    }

    .amount_symbol{
        white-space: nowrap;
        width: max-content;
        background-color: main.$primary-color-light;
        color: main.$primary-color;
        padding: 4px 8px;
        border-radius: 3px;
    }
</style>
