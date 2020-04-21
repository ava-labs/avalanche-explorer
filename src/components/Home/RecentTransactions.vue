<template>
    <div class="recent_tx">
        <div class="header">
            <h4>Recent Transactions</h4>
            <router-link to="/tx">View All</router-link>
        </div>
        <div class="list">
            <recent-tx-row v-for="tx in transactions" :key="tx.id" class="recent_tx_rows" :transaction="tx"></recent-tx-row>
        </div>
    </div>
</template>
<script>
    import api from '@/axios';
    import Vue from 'vue';

    import RecentTxRow from "@/components/Home/RecentTxRow";

    export default Vue.extend({
        components: {
            RecentTxRow
        },
        data(){
            return {
                all_tx: [],
            }
        },
        created(){
            const parent = this;
            let txNum = 10;
            api.get('/x/transactions?sort=timestamp-desc&limit=10').then((res) => {
                const list = res.data;
                console.log(list);
                parent.all_tx = list;
                // console.log(res);
            });
        },
        computed: {
            transactions(){
                return this.all_tx.slice(0,8);
            }
        }
    });
</script>
<style scoped lang="scss">
    .list{
        /*max-height: 500px;*/
        /*overflow-y: scroll;*/
    }

    .col_1{
        padding: 0px 30px;
    }
    .recent_tx_rows{
        /*display: grid;*/
        width: 100%;
        /*grid-template-columns: max-content 1fr 80px;*/
        font-size: 12px;
        background-color: #f4f4f4;
        border-radius: 2px;
        margin-bottom: 2px;
        box-sizing: border-box;
    }
</style>
