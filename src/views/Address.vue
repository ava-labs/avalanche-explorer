<template>
    <div class="address_detail">
        <div class="meta" v-if="this.metaData">
            <h1>Address Details</h1>
            <div class="meta_row">
                <p class="label">Address</p>
                <p class="addr"><b>X-{{address}}</b> <span v-if="alias">{{alias}}</span></p>
            </div>
            <div class="meta_row">
                <p class="label">Balance</p>
                <p>{{balance}} AVA</p>
            </div>
            <div class="meta_row">
                <p class="label">Total Received</p>
                <p>{{totalReceived}} AVA</p>
            </div>
            <div class="meta_row">
                <p class="label">Total Sent</p>
                <p>{{totalSent}} AVA</p>
            </div>
            <div class="meta_row">
                <p class="label">Transaction Count</p>
                <p>{{txCount}}</p>
            </div>
        </div>


        <div v-if="isAjax">
            <p>Loading</p>
        </div>
        <transition name="fade">
            <div v-if="!isAjax" class="transactions">
                <h4>Transactions</h4>
                <tx-table class="tx_table" :transactions="orderedTx"></tx-table>
            </div>
        </transition>


    </div>
</template>
<script>
    import api from "../axios";
    import TxTable from "../components/AddressDetail/TxTable";
    import Big from "big.js";
    import {stringToBig} from "../helper";
    import AddressDict from '@/known_addresses';

    export default {
        components: {
            TxTable
        },
        data(){
            return{
                transactions: [],
                isAjax: false,
                metaData: null,
            }
        },
        watch:{
            address(val){
                this.updateData();
            }
        },
        methods: {
            updateData(){
                let parent = this;
                let url = `/x/transactions?address=${this.address}`;
                this.isAjax = true;
                api.get(url).then((res) => {
                    parent.isAjax = false;
                    const data = res.data.transactions;
                    parent.transactions = data;
                    // console.log(res);
                });


                url = `/x/addresses/${this.address}`;
                api.get(url).then((res) => {
                    parent.isAjax = false;
                    const data = res.data;
                    parent.metaData = data;
                    console.log(data);
                });
            }
        },
        created(){
            this.updateData();
        },
        computed: {
            alias(){
                if(AddressDict[this.address]){
                    return AddressDict[this.address]
                }
                return '';
            },
            orderedTx(){
                let txs = this.transactions;
                txs.sort((a,b) => {
                    let timeA = new Date(a.timestamp);
                    let timeB = new Date(b.timestamp);

                    if(timeA.getTime() > timeB.getTime()){
                        return -1;
                    }else{
                        return  1;
                    }
                });
                return txs
            },
            address(){
                return this.$route.params.address;
            },
            balance(){
                if(!this.metaData) return Big(0);
                return stringToBig(this.metaData.balance, 9).toFixed(9);
                // return Big(this.metaData.balance);
            },
            txCount(){
                return this.metaData.transactionCount;
            },
            totalReceived(){
                return stringToBig(this.metaData.totalReceived, 9).toFixed(9);
                // return this.metaData.totalReceived;
            },
            totalSent(){
                let total = this.metaData.totalSent;
                console.log(total)
                return stringToBig(total, 9).toFixed(9);
            },
        }
    }
</script>
<style lang="scss">
    .address_detail{

        h4{
            padding: 15px 30px;
            font-size: 12px;
            margin: 0;
        }
    }
</style>
<style scoped lang="scss">
    @use '../main';


    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    h1{
        padding: 15px 30px;
        font-size: 16px;
    }

    .meta{
        overflow: auto;
        background-color: #fff;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        border-radius: 6px;
        margin-bottom: 15px;
        padding: 15px 30px;
    }


    .meta_row{
        /*padding: 0px 15px;*/
        font-size: 12px;
        display: grid;
        grid-template-columns: 140px 1fr;

        padding: 15px 30px;
        border-bottom: 1px solid #f2f2f2;
        .label{
            font-weight: normal;
            margin-right: 8px;
        }

        &:last-of-type{
            border: none;
        }
    }


    .transactions{
        background-color: #fff;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        border-radius: 6px;
        /*height: 500px;*/
        overflow: auto;
        padding: 15px 30px;
    }

    .tx_table{
        font-size: 12px;
        /*max-height: 500px;*/

    }


    .addr{
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;

        span{
            background-color: #e6ffe6;
            border: 1px solid #56C18D;
            color: #56C18D;
            width: max-content;
            padding: 4px 8px;
            margin: 0px 30px;
        }
    }

    @media only screen and (max-width: main.$mobile_width) {
        .meta{
            padding: 15px;
        }

        .meta_row{
            padding: 8px;
        }

        .transactions{
            padding: 8px;
        }
    }
</style>
