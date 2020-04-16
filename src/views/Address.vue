<template>
    <div class="address_Detail">
        <h1>Address Detail</h1>
        <p>Address | {{address}}</p>


        <div class="transactions">
            <h4>Transactions</h4>
            <tx-table class="tx_table" :transactions="transactions"></tx-table>
        </div>
    </div>
</template>
<script>
    import api from "../axios";
    import TxTable from "../components/AddressDetail/TxTable";

    export default {
        components: {
            TxTable
        },
        data(){
            return{
                transactions: null,
            }
        },
        created(){
            let parent = this;
            let url = `/addresses/${this.address}/transactions`;
            api.get(url).then((res) => {
                const data = res.data;
                parent.transactions = data;
                console.log(res);
            });
        },
        computed: {
            address(){
                return this.$route.params.address;
            }
        }
    }
</script>
<style scoped>
    .address_Detail{
        padding: 30px 15vw;
    }

    .transactions{
        background-color: #eaeaea;
        /*height: 500px;*/
        overflow: auto;
    }

    .tx_table{
        max-height: 500px;
    }
</style>