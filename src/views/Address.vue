<template>
    <div class="address_detail">

        <div class="meta">
            <div class="meta_row">
                <p class="label">Address</p>
                <p>{{address}}</p>
            </div>
        </div>



        <div class="transactions">
            <h4>Transactions</h4>
            <tx-table class="tx_table" :transactions="orderedTx"></tx-table>
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
                transactions: [],
            }
        },
        created(){
            let parent = this;
            let url = `/x/addresses/${this.address}/transactions`;
            api.get(url).then((res) => {
                const data = res.data;
                parent.transactions = data;
                console.log(res);
            });
        },
        computed: {
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
            }
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

    .address_detail{
        padding: main.$container_padding_l;
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
        display: flex;

        .label{
            font-weight: bold;
            /*width: 90px;*/
            text-align: right;
            margin-right: 8px;
        }
    }


    .transactions{
        background-color: #fff;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        border-radius: 6px;
        /*height: 500px;*/
        overflow: auto;
    }

    .tx_table{
        font-size: 12px;
        /*max-height: 500px;*/
    }


    @media only screen and (max-width: main.$mobile_width) {
        .address_detail{
            padding: main.$container_padding_mobile;
        }
    }
</style>
