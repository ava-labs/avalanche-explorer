<template>
    <div class="recent_tx">

        <div class="avatar">
            <p>Tx</p>
        </div>


        <div class="info_col">
            <router-link :to="`/tx/${tx_id}`" class="id">{{tx_id.substring(0,12)}}...</router-link>
            <p class="time">{{ago}}</p>
        </div>


        <div class="info_col">
            <div  class="to" v-for="(input,i) in inputs" :key="i">
                <p class="bold"><b>From</b> </p>
                <router-link class="addr" to="/">???</router-link>
            </div>
        </div>


        <div class="info_col">
            <div  class="to" v-for="(output,i) in outputs" :key="i">
                <p class="bold"><b>To</b> </p>
                <router-link class="addr" :to="`/address/`+output.output.addresses[0]">{{output.output.addresses[0]}}</router-link>
<!--                <p class="amount">{{output.output.amount.toFixed(1)}} <span>{{output.assetID}}</span></p>-->
                <p class="amount">{{output.output.amount.toFixed(1)}} <span>AVA</span></p>
            </div>
        </div>
    </div>
</template>
<script >
    // import api from "@/axios";
    import Vue from 'vue';
    // import {ApiTransaction} from "@/js/types";
    import moment from 'moment';

    moment().format();

    export default {
        data(){
            return{

            }
        },
        // created() {
            // console.log(this.transaction)
        // },
        props:{
            transaction: {
                type: Object,
                required: true,
            }
        },
        computed: {
            assets(){
                return this.$store.state.assets;
            },
            tx_id(){
                return this.transaction.id;
            },
            ago(){
                let stamp = this.transaction.timestamp;
                let date = new Date(stamp);
                // console.log(stamp);
                // console.log()
                return moment(date).fromNow();
                // return `2 seconds ago`
            },
            inputAssets(){
                let res = {};
                if(this.transaction) {
                    // console.log('inputs:');
                    let inputs = this.transaction.unsignedTx.inputs;
                    for (let i=0; i< inputs.length; i++){
                        let input = inputs[i];
                        // console.log(input);
                        if(res[input.assetID]){
                            res[input.assetID] += input.input.amount;
                        }else{
                            res[input.assetID] = input.input.amount;
                        }
                    }
                }
                return res;
            },
            outputs(){
                let res = this.transaction.unsignedTx.outputs.filter((val,index) => {
                    // if(val.output.amount > 1000000000){
                    //     return false
                    // }
                    return true
                });
                return res;
            },
            inputs(){
                return this.transaction.unsignedTx.inputs;
            },



            outputAssets(){
                let res = {};
                if(this.transaction) {
                    // console.log('Outs:')
                    let outputs = this.transaction.unsignedTx.outputs;
                    for (let i=0; i< outputs.length; i++){
                        let output = outputs[i];
                        // console.log(output);
                        let addr = output.output.addresses[0];
                        // If this is a change output utxo skip it
                        // console.log(addr);
                        if(this.inputAssets[addr]){
                            // console.log(`${addr} is change`);
                            continue;
                        }

                        if(res[output.assetID]){
                            res[output.assetID] += output.output.amount;
                        }else{
                            res[output.assetID] = output.output.amount;
                        }
                    }
                }
                return res;
            }
        }
    }
</script>
<style scoped lang="scss">
    .recent_tx{
        padding: 12px 14px;
        position: relative;
        display: grid;
        grid-template-columns: min-content 120px 1fr 1fr;
        flex-direction: row;
        align-items: center;
    }
    .avatar{
        width: 35px;
        height: 35px;
        border-radius: 35px;
        line-height: 35px;
        text-align: center;
        background-color: #F1F2F3;

        p{
            width: 100%;
            font-weight: 400; /* 700 */
            color: #272727;
        }
    }

    .time{
        font-weight: 400; /* 700 */
        font-size: 10px;
        margin-top: 5px;
        color: #7A838E;
    }
    .label{
        font-size: 12px;
        font-weight: 400; /* 700 */
        overflow: hidden;
    }
    .data{
        /*width: 100%;*/
        display: flex;
    }

    .info_col{
        padding: 0px 10px;
    }

    .id{
        color: main.$primary-color;
        text-decoration: none;
        font-weight: 400; /* 700 */
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .to{
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 5px;

        .bold{
            padding: 4px 0px;
            text-align: right;
            padding-right: 2px;
        }
        .addr{
            text-overflow: ellipsis;
            overflow: hidden;
            padding-left: 0;
            color: #7A838E;
            font-family: monospace;
            text-decoration: none;
        }
        .addr:hover{
            text-decoration: underline;
        }

        p, a{
            padding: 4px 12px;
        }
    }

    .amount{
        background-color: main.$primary-color-light;
        font-size: 11px;
        color: main.$primary-color;
        border-radius: 4px;
    }

    @include main.device_xs {
        .info_col{
            padding: 0 10px 0 0;
        }
    }
</style>
