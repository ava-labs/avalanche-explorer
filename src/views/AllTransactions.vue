<template>
    <div class="all_transactions">
        <div class="rows">
            <tx-row class="tx_item" v-for="tx in transactions" :transaction="tx" :key="tx.id"></tx-row>
        </div>
    </div>
</template>
<script>
    import api from "@/axios";
    import RecentTxRow from "../components/Home/RecentTxRow";
    import TxRow from "../components/rows/TxRow/TxRow";
    export default {
        components: {
            TxRow
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
<style scoped lang="scss">
    @use '../main';

    .all_transactions{
        font-size: 12px;
        padding: 30px 18vw;
    }

    .rows{
        background-color: #fff;
        border-radius: 6px;
        padding: 15px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }
    .tx_item{
        border-bottom: 1px solid #e7e7e7;
    }

    @media only screen and (max-width: main.$mobile_width) {
        .all_transactions {
            padding: main.$container_padding_mobile;
        }
    }
</style>
