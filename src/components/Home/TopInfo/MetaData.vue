<template>
    <div>
        <h4>Network Meta Data</h4>
        <div class="meta_data">
            <div class="meta">
                <img src="@/assets/ava_price.png">
                <div class="data">
                    <p class="meta_title">AVA Market Cap</p>
                    <div>
                        <p>$2.3B</p>
                        <p class="change">+ 24%</p>
                    </div>
                </div>
            </div>

            <div class="meta">
                <img src="@/assets/ava_transactions.png">
                <div class="data">
                    <p class="meta_title">Transactions (24Hr)</p>
                    <div>
                        <p>{{avaTxCount}} ({{tpsText}} TPS)</p>
                    </div>
                </div>
            </div>

            <div class="meta">
                <img src="@/assets/price.png">
                <div class="data">
                    <p class="meta_title">AVA Price</p>
                    <div>
                        <p>${{avaPrice.toFixed(2)}}</p>
                        <p class="change">+ 24%</p>
                    </div>
                </div>
            </div>


            <div class="meta">
                <img src="@/assets/stake_amount.png">
                <div class="data">
                    <p class="meta_title">Total Stake Amount</p>
                    <div>
                        <p>{{totalStake}} AVA</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "@/axios";
    export default {
        data(){
            return {
                totalStake: 123994324,
                avaMarketCap: 0,
                avaTxCount: 0,
                avaPrice: 34.00,
            }
        },
        created() {
            let parent = this;
            // get 24h transaction counts
            axios.get('/x/transactions/aggregates?timeframe=day').then(res => {
                // const list = res.data;
                // parent.transactions = list;
                console.log(res);
                parent.avaTxCount = res.data.transactionCount;
            });
        },
        computed: {
            tpsText(){
                let day = (60*60*24)
                let avg = (this.avaTxCount/day);
                return avg.toFixed(0);
            }
        }
    }
</script>
<style scoped lang="scss">
    .meta_data{
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 30px;
        column-gap: 30px;
        padding: 10px 0px;


        .meta{
            display: grid;
            grid-template-columns: 35px 1fr;
            font-size: 12px;
            column-gap: 10px;

            img{
                width: 100%;
                max-height: 35px;
                object-fit: contain;
            }

            .meta_title{
                font-weight: bold;
            }

            .data > div{
                display: flex;
            }

            .data p{
                color: #7A838E;
                flex-grow: 1;
                padding: 2px 4px;
            }

            .data .meta_title{
                color: #000000;
                white-space: nowrap;
                margin-bottom: 4px;
            }

            .change{
                background-color: #E4FBEF;
                color: #56C18D !important;
                padding: 2px 4px;
                border-radius: 2px;
                flex-grow: 0 !important;
            }
        }
    }


</style>
