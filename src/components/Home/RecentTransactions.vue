<template>
    <div class="recent_tx">
        <div class="header">
            <h4>Latest Transactions</h4>
            <p class="chain">You are viewing transactions for <span>AVA X-Chain</span></p>
        </div>
        <div class="list">
            <div class="table_headers recent_tx_rows">
                <p></p>
                <p>ID</p>
                <p>From</p>
                <p>To</p>
<!--                <p>Amount</p>-->
            </div>
            <tx-row v-for="tx in transactions" :key="tx.id" class="recent_tx_rows" :transaction="tx"></tx-row>
        </div>
        <div class="bottom">
            <router-link to="/tx" class="view_all">View All transactions</router-link>
        </div>
    </div>
</template>
<script>
    import api from '@/axios';
    import Vue from 'vue';

    import TxRow from "@/components/rows/TxRow/TxRow";

    export default Vue.extend({
        components: {
            TxRow
        },
        data(){
            return {
                // all_tx: [],
                transactions: [],
            }
        },
        created(){
            const parent = this;
            let txNum = 8;
            api.get(`/x/transactions?sort=timestamp-desc&limit=${txNum}`).then((res) => {
                const list = res.data.transactions;
                parent.transactions = list;
            });
        },
    });
</script>
<style scoped lang="scss">
    @use '../../main';


    .table_headers{
        display: grid;
        grid-template-columns: 35px 120px 1fr 1fr;
        border: none !important;
        padding: 0px 14px;

        p{
            padding: 0px 10px;
            font-weight: bold;
        }
    }
    .chain{
        font-size: 12px;
        color: #929BA6;
        font-weight: lighter;
        text-align: right;

        span{
            padding: 4px 12px;
            border-radius: 4px;
            color: #976CFA;
            background-color: #EBE4FB;
            line-height: 2em;
            word-break: keep-all;
            white-space: nowrap;
        }
    }
    .col_1{
        padding: 0px 30px;
    }


    .list{
        padding: 0px 30px;
    }

    .header{
        display: flex;
        padding: 15px 30px;
        align-items: center;
        border-bottom: 1px solid #E7E7E7;
        margin-bottom: 10px;

        h4{
            margin: 0;
            flex-grow: 1;
            font-size: 12px;
        }
    }



    .recent_tx_rows{
        /*display: grid;*/
        width: 100%;
        /*grid-template-columns: max-content 1fr 80px;*/
        font-size: 12px;
        /*background-color: #f4f4f4;*/
        border-radius: 2px;
        margin-bottom: 2px;
        box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
    }


    .bottom{
        display: flex;
        flex-flow: row-reverse;
    }
    .view_all{
        display: block;
        width: max-content;
        text-decoration: none;
        margin: 30px;
        background-color: #000;
        color: #fff;
        padding: 12px 24px;
        font-size: 12px;
        border-radius: 4px;
    }

    @media only screen and (max-width: main.$mobile_width) {
        .view_all{
            width: 100%;
            text-align: center;
        }

        .table_headers{
            display: none;
        }

        .header{
            padding: 15px;
        }
        .list{
            padding: 0;
        }
    }
</style>
