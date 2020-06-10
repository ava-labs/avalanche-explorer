<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <v-tooltip bottom left>
                    <template v-slot:activator="{ on }">
                        <h2 v-on="on">Subnets</h2>
                    </template>
                    <span>
                        A Subnet is a set of validators. A Subnet validates a set of blockchains.
                        <br />Each blockchain is validated by exactly one Subnet, which is specified on blockchain creation.
                    </span>
                </v-tooltip>
            </div>
            <div class="meta_data">
                <div>
                    <img src="@/assets/subnet.png" />
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <p class="label" v-on="on">Subnetworks</p>
                            </template>
                            <span>A Subnet is a set of validators. A Subnet validates a set of blockchains.</span>
                        </v-tooltip>
                        <p class="meta_val">{{totalSubnets}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/blockchain.png" />
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <p class="label" v-on="on">Blockchains</p>
                            </template>
                            <span>Total number of blockchains created on the AVA network.</span>
                        </v-tooltip>
                        <p class="meta_val">{{totalBlockchains}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/validators.png" />
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <p class="label" v-on="on">Validators</p>
                            </template>
                            <span>Total number of nodes participating in the consensus protocol of the AVA network.</span>
                        </v-tooltip>
                        <p class="meta_val">{{totalValidators}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/ava_price.png" />
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <p class="label" v-on="on">Total Stake Amount</p>
                            </template>
                            <span>Total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method.</span>
                        </v-tooltip>
                        <p class="meta_val">{{(totalStake).toFixed(2)}} AVA</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Big from "big.js";

export default {
    props: {
        totalSubnets: Number,
        totalBlockchains: Number,
        totalValidators: Number,
        totalStake: Big
    }
};
</script>
<style scoped lang="scss">
@use '../../main';

.metadata {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 20% 20% 20% 40%;

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 15px;
    }

    > div {
        padding: 30px;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    p {
        font-size: 32px;
        font-weight: bold;
    }

    .label {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 6px;
        opacity: 0.7;
    }

    .meta_val {
        line-height: 1em;
    }
}

@include main.device_sm {
    .meta_data {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        > div {
            padding: 30px 0 0;
        }
    }
}
</style>
