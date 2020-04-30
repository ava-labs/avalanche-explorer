<template>
    <div class="tx_row">
        <div class="avatar">
            <p>Tx</p>
        </div>


        <div class="info_col id_col">
            <router-link :to="`/tx/${tx_id}`" class="id">{{tx_id}}...</router-link>
            <p class="time">{{ago}}</p>
        </div>


        <div class="info_col">
            <utxo-input v-for="(input,i) in inputs" :key="i" :input="input"></utxo-input>

        </div>


        <div class="to_amount">
            <output-utxo class="utxo_out" v-for="(output,i) in outputs" :key="i" :output="output"></output-utxo>
        </div>
    </div>
</template>
<script >
    import UtxoInput from './Input';
    import OutputUtxo from "@/components/rows/TxRow/OutputUtxo";

    // import api from "@/axios";
    // import Vue from 'vue';
    // import {ApiTransaction} from "@/js/types";
    import moment from 'moment';


    export default {
        components: {
            UtxoInput,
            OutputUtxo
        },
        data(){
            return{

            }
        },
        created() {
            // console.log(this.transaction)
        },
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
                return moment(date).fromNow();
            },
            outputs(){
                let ins = this.inputs;

                let senders = [];

                for(let i=0 ;i<ins.length; i++){
                    let input = ins[i];
                    let addrs = input.output.addresses;
                    senders.push(...addrs)
                }

                console.log(senders);

                let res = this.transaction.outputs.filter((val,index) => {
                    console.log(val);
                    let addrs = val.addresses;
                    // if(addrs.length === 1){
                    //     return true;
                    // }

                    // If change UTXO then don't show
                    let flag = false;
                    addrs.forEach(addr => {
                        if(senders.includes(addr)) flag = true;
                    });
                    if(flag) return false;


                    return true
                });
                return res;
            },
            inputs(){
                return this.transaction.inputs;
            },
        }
    }
</script>
<style scoped lang="scss">
    @use '../../../main';

    .tx_row{
        padding: 12px 0px;
        position: relative;
        display: grid;
        grid-template-columns: min-content 120px 1fr 1fr;
        flex-direction: row;
        align-items: center;
        font-size: 12px;
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
            font-weight: bold;
            color: #272727;
        }
    }

    .time{
        font-weight: bold;
        font-size: 10px;
        margin-top: 5px;
        color: #7A838E;
        word-break: keep-all;
        white-space: nowrap;
    }
    .label{
        font-size: 12px;
        font-weight: bold;
        overflow: hidden;
    }
    .data{
        /*width: 100%;*/
        display: flex;
    }

    .info_col{
        padding: 0px 10px;
        overflow: auto;
    }

    .id{
        color: #71C5FF;
        text-decoration: none;
        font-weight: normal;
        display: block;
        /*max-width: 80px;*/
        /*width: 80px;*/
        overflow: hidden;
        text-overflow: ellipsis;
    }



    .utxo_out{
        /*border-bottom: 1px dashed #dedede;*/
        margin-bottom: 6px;
        /**/
        /*&:last-of-type{*/
        /*    border: none;*/
        /*}*/
    }



    @media only screen and (max-width: main.$mobile_width) {
        .tx_row{
            padding: 8px;
            grid-template-columns: none;
            /*grid-template-columns: min-content 120px 1fr 1fr 1fr;*/

            grid-template-rows: max-content max-content max-content max-content max-content;
        }

        .avatar{
            display: none;
        }

        .id_col{
            display: flex;
            align-items: baseline;
            a{
                flex-grow: 1;
            }
        }
    }
</style>
