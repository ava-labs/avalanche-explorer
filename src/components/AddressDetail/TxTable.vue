<template>
    <div class="tx_table" v-if="transactions">
        <div class="pages">
            <p>{{from}} - {{to}} of {{pageNum*pagination}}</p>
            <button v-for="page in pageNum" @click="setPage(page-1)" :key="page">{{page}}</button>
        </div>
        <div class="headers">
            <p>Network</p>
            <p>Blockchain</p>
            <p>Inputs</p>
            <p>Outputs</p>
        </div>
        <div class="items">
            <div v-for="(tx, i) in tx_page" class="tx_item" :key="i">
                <p>{{tx.unsignedTx.networkID}}</p>
                <p>{{tx.unsignedTx.blockchainID}}</p>
                <div>
                    <div v-for="(input, i) in tx.unsignedTx.inputs" :key="i">
                        <router-link :to="`/tx/${input.txID}`">{{input.txID}}</router-link>
                    </div>
                </div>
                <div>
                    <div v-for="(output, i) in tx.unsignedTx.outputs" :key="i">
                        <p>{{output.assetID}}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    const PAGINATION = 25;
    export default {
        data(){
            return{
                pageNow: 0,
                from: 0,
                to: PAGINATION,
                pagination: PAGINATION
            }
        },
        props: {
            transactions: Array
        },
        computed: {
            tx_page(){
                let start = this.pageNow * PAGINATION;
                let end = start+PAGINATION;

                return this.transactions.slice(start, end);
            },
            pageNum(){
                return  Math.ceil(this.transactions.length/PAGINATION);
            }
        },
        methods: {
            setPage(num){
                let start = num * PAGINATION;
                let end = start+PAGINATION;

                this.from = start;
                this.to = end;
                this.pageNow = num;
            }
        }
    }
</script>

<style scoped>


    .tx_table{
        display: grid;
        height: 100%;
        grid-template-rows: 30px 30px 1fr;
    }

    .pages{
        border-bottom: 1px solid #303030;
        display: flex;
        justify-content: center;
        overflow: auto;
    }

    .headers, .tx_item{
        display: grid;
        grid-template-columns: 160px 160px 1fr 1fr;
    }

    .tx_item{
        border-bottom: 1px solid #eaeaea;
        font-size: 12px;
    }
    .tx_item > *{
        padding: 6px;
    }

    p{
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .headers{
        border-bottom: 1px solid #808080;
    }
    .headers p{
        /*line-height: 30px;*/
        font-size: 13px;
        font-weight: bold;
        padding: 6px;
    }

    .items{
        overflow-y: scroll;
    }
</style>