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
import {stringToBig} from "@/helper";
    export default {
        data(){
            return {
                avaMarketCap: 0,
                avaTxCount: 0,
                avaPrice: 34.00,
            }
        },
        created() {
            let parent = this;

            let dayMs = 1000 * 60 * 60 * 24;
            let endMs = Date.now();
            let startMs = endMs - dayMs;

            let startTime = new Date(startMs).toISOString();
            let endTime = new Date(endMs).toISOString();

            // get 24h transaction counts
            axios.get(`/x/transactions/aggregates?startTime=${startTime}&endTime=${endTime}`).then(res => {
                // const list = res.data;
                // parent.transactions = list;
                console.log(res);
                parent.avaTxCount = res.data.aggregates.transactionCount;
            });
        },
        computed: {
            tpsText(){
                let day = (60*60*24)
                let avg = (this.avaTxCount/day);
                return avg.toFixed(0);
            },
            totalStake(){
                let res =  this.$store.getters['Platform/totalStakeAmount'];
                return stringToBig(res,9).toFixed(0)
            }
        }
    }
</script>
<style scoped lang="scss">
    @use '../../../main';
    .meta_data{
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 30px;
        column-gap: 30px;
        padding: 10px 0px;
        /*display: flex;*/
        flex-wrap: wrap;
        overflow: auto;


        .meta{
            display: grid;
            grid-template-columns: 35px 1fr;
            font-size: 12px;
            column-gap: 10px;
            margin: 1px;
            margin-bottom: 20px;
            display: flex;
            flex-grow: 1;
            justify-content: flex-start;

            /*&:nth-of-type(2n){*/
            /*    justify-content: flex-end;*/
            /*}*/



            img{
                /*width: 100%;*/
                width: 35px;
                height: 35px;
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

    @media only screen and (max-width: main.$mobile_width) {
        .meta_data{
            flex-direction: column;
            /*grid-template-columns: none;*/
            /*grid-template-rows: min-content min-content min-content min-content;*/
        }
    }
</style>
