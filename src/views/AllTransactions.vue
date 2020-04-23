<template>
    <div class="all_transactions">
        <recent-tx-row class="tx_item" v-for="tx in transactions" :transaction="tx" :key="tx.id"></recent-tx-row>
    </div>
</template>
<script>
    import api from "@/axios";
    import RecentTxRow from "../components/Home/RecentTxRow";

    export default {
        components: {
            RecentTxRow
        },
        data(){
            return{
                txs: [],
            }
        },
        created() {
            let parent = this;
            let url = `/x/transactions`;
            api.get(url).then((res) => {
                const data = res.data;
                parent.txs = data;
                console.log(data);
            });
        },
        computed:{
            transactions(){
                let res = this.txs;
                    res.sort((a,b) => {
                        let timeA = new Date(a.timestamp);
                        let timeB = new Date(b.timestamp);

                        if(timeA.getTime() > timeB.getTime()){
                            return -1;
                        }else{
                            return  1;
                        }
                    });

                return res;
            }
        }
    }
</script>
<style scoped>
    .all_transactions{
        margin: 30px 18vw;
        background-color: #fff;
        padding: 30px;
        border-radius: 6px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        font-size: 12px;
    }

    .tx_item{
        border-bottom: 1px solid #e7e7e7;
    }
</style>
