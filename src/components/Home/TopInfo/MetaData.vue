<template>
    <div>
        <div class="header">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <h2 class="meta_title" v-on="on">AVA Network Activity</h2>
                </template>
                <span>Key figures of the AVA network.</span>
            </v-tooltip>
        </div>
        <div class="meta_data">
            <div class="meta">
                <img src="@/assets/ava_transactions.png" />
                <div class="data">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p class="meta_title" v-on="on">24h Transactions</p>
                        </template>
                        <span>Total number of queries or modifications of the states of all blockchains on the AVA network in the past 24 hours.</span>
                    </v-tooltip>
                    <div>
                        <p>{{avaTxCount}} ({{tpsText}} TPS)</p>
                    </div>
                </div>
            </div>
            <div class="meta">
                <img src="@/assets/ava_price.png" />
                <div class="data">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p class="meta_title" v-on="on">24h Volume</p>
                        </template>
                        <span>Total value of $AVA tokens transferred on the AVA network in the past 24 hours.</span>
                    </v-tooltip>
                    <div>
                        <p>{{avaVolume}} AVA</p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                </div>
            </div>
            <div class="meta">
                <img src="@/assets/validators.png" />
                <div class="data">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p class="meta_title" v-on="on">Validators</p>
                        </template>
                        <span>Total number of nodes participating in the consensus protocol of the AVA network.</span>
                    </v-tooltip>
                    <div>
                        <p>{{validatorCount}}</p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                </div>
            </div>
            <div class="meta">
                <img src="@/assets/stake_amount.png" />
                <div class="data">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p class="meta_title" v-on="on">Total Staked</p>
                        </template>
                        <span>Total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method.</span>
                    </v-tooltip>
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
            let res = this.$store.getters["Platform/totalStake"];
            res = stringToBig(res.toString(), 9).toFixed(0);
            return parseInt(res).toLocaleString();
        },
        validatorCount() {
            return this.$store.getters['Platform/totalValidators'];
        },
        avaVolume() {
            let assets = this.$store.state.assets;
            let ava = assets["21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"];

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
