<template>
    <div>
        <div class="header">
            <h2>AVA Network Activity</h2>
        </div>
        <div class="meta_data">
            <div class="meta">
                <img src="@/assets/ava_transactions.png" />
                <div class="data">
                    <p class="meta_title">24h Transactions</p>
                    <div>
                        <p>{{avaTxCount}} ({{tpsText}} TPS)</p>
                    </div>
                </div>
            </div>
            <div class="meta">
                <img src="@/assets/ava_price.png" />
                <div class="data">
                    <p class="meta_title">24h Volume</p>
                    <div>
                        <p>{{avaVolume}} AVA</p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                </div>
            </div>
            <div class="meta">
                <img src="@/assets/validators.png" />
                <div class="data">
                    <p class="meta_title">
                        Validators
                    </p>
                    <div>
                        <p>{{valdiatorCount}}</p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                </div>
            </div>
            <div class="meta">
                <img src="@/assets/stake_amount.png" />
                <div class="data">
                    <p class="meta_title">
                        Total Staked
                    </p>
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
import { stringToBig } from "@/helper";
export default {
    data() {
        return {
            avaMarketCap: 0,
            avaTxCount: 0,
            avaPrice: 34.0
        };
    },
    created() {
        let parent = this;

        let dayMs = 1000 * 60 * 60 * 24;
        let endMs = Date.now();
        let startMs = endMs - dayMs;

        let startTime = new Date(startMs).toISOString();
        let endTime = new Date(endMs).toISOString();

        // get 24h transaction counts
        axios
            .get(
                `/x/transactions/aggregates?startTime=${startTime}&endTime=${endTime}`
            )
            .then(res => {
                // const list = res.data;
                // parent.transactions = list;
                // console.log(res);
                parent.avaTxCount = res.data.aggregates.transactionCount;
            });
    },
    computed: {
        tpsText() {
            let day = 60 * 60 * 24;
            let avg = this.avaTxCount / day;
            if (avg > 1) {
                return avg.toFixed(0);
            } else {
                return avg.toFixed(2);
            }
        },
        totalStake() {
            let res = this.$store.getters["Platform/totalStakeAmount"];
            res = stringToBig(res, 9).toFixed(0);
            return parseInt(res).toLocaleString();
        },
        valdiatorCount() {
            return this.$store.state.Platform.validators.length;
        },
        avaVolume() {
            let assets = this.$store.state.assets;
            let ava =
                assets["21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"];

            if (!ava) {
                return 0;
            }

            let res = stringToBig(ava.volume_day, ava.denomination);
            return parseInt(res.toFixed(0)).toLocaleString();
        }
    }
};
</script>
<style scoped lang="scss">
@use '../../../main';

.header {
    padding-bottom: 20px;

    h2 {
        margin: 0;
        font-size: 18px;
    }
}

.meta_data {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    row-gap: 30px;
    column-gap: 30px;
    padding: 4px 0 0;
    flex-wrap: wrap;
    overflow: auto;

    .meta {
        font-size: 12px;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;

        img {
            width: 16px;
            height: 16px;
            max-height: 23px;
            object-fit: contain;
            margin-right: 4px;
        }

        .data > div {
            display: flex;
        }

        .data p {
            flex-grow: 1;
            padding: 2px 4px;
            font-size: 18px;
        }

        .data .meta_title {
            color: #7a838e;
            font-size: 12px;
            margin-bottom: 4px;
        }

        .change {
            background-color: #e4fbef;
            color: #56c18d !important;
            padding: 2px 4px;
            border-radius: 2px;
            flex-grow: 0 !important;
        }
    }
}

@media only screen and (max-width: main.$mobile_width) {
    .meta_data {
        flex-direction: column;
        /*grid-template-columns: none;*/
        /*grid-template-rows: min-content min-content min-content min-content;*/
    }
}

@media only screen and (max-width: main.$medium_width) {
    .meta_data {
        /*grid-template-columns: none;*/
        /*grid-template-columns: none;*/
        /*grid-template-rows: min-content min-content min-content min-content;*/
    }
}
</style>
