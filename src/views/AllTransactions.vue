<template>
    <div class="all_transactions">
        <div class="card">
            <h4>All Transactions</h4>
            <div class="bar">
                <p class="count">{{totalTx}} transactions found</p>
                <pagination-controls :total="totalTx" :limit="limit" @change="page_change"></pagination-controls>
            </div>
            <div class="rows">
<!--                <transition-group name="fade">-->
                    <tx-row class="tx_item" v-for="tx in transactions" :transaction="tx" :key="tx.id"></tx-row>
<!--                </transition-group>-->
            </div>
        </div>
    </div>
</template>
<script>
    import api from "@/axios";
    import TxRow from "../components/rows/TxRow/TxRow";
    import PaginationControls from "../components/misc/PaginationControls";

    export default {
        components: {
            TxRow,
            PaginationControls
        },
        data(){
            return{
                totalTx: 0,
                limit: 25, // how many to display
                offset: 0,
                txs: [],
            }
        },
        created() {
            this.getTx();
        },
        methods: {
            page_change(val){
                this.offset = val;
                this.getTx();
            },
            getTx(){
                let parent = this;
                let sort = "timestamp-desc";
                let url = `/x/transactions?sort=${sort}&offset=${this.offset}&limit=${this.limit}`;
                api.get(url).then((res) => {
                    const data = res.data.transactions;
                    parent.txs = data;
                    parent.totalTx = res.data.count;
                    console.log(res.data);
                });
            }
        },
        computed:{
            transactions(){
                let res = this.txs;
                    // res.sort((a,b) => {
                    //     let timeA = new Date(a.timestamp);
                    //     let timeB = new Date(b.timestamp);
                    //
                    //     if(timeA.getTime() > timeB.getTime()){
                    //         return -1;
                    //     }else{
                    //         return  1;
                    //     }
                    // });

                return res;
            },
        }
    }
</script>
<style scoped lang="scss">
    @use '../main';

    .all_transactions{
        font-size: 12px;
    }

    .count{
        font-size: 20px;
        color: #808080;
        font-weight: lighter;
    }

    .bar{
        display: flex;
        align-items: center;
        > p{
            flex-grow: 1;
        }
    }
    .card{
        background-color: #fff;
        border-radius: 6px;
        padding: 15px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }


    .tx_item{
        border-bottom: 1px solid #e7e7e7;

        &:last-of-type{
            border: none !important;
        }
    }
</style>
