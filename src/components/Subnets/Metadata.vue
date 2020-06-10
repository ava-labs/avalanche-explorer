<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    Subnets
                    <v-tooltip bottom left>
                        <template v-slot:activator="{ on }">
                            <fa
                                v-on="on"
                                icon="info-circle"
                                transform="shrink-3"
                                :style="{ color: '#e8e7ea' }"
                            ></fa>
                        </template>
                        <span>
                            A Subnet is a set of validators. A Subnet validates a set of blockchains.
                            <br />Each blockchain is validated by exactly one Subnet, which is specified on blockchain creation.
                        </span>
                    </v-tooltip>
                </h2>
            </div>
            <div class="meta_data">
                <div>
                    <img src="@/assets/subnet.png" />
                    <div>
                        <p class="label">
                            Subnetworks
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total number of subnets created on the AVA network</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">{{totalSubnets}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/blockchain.png" />
                    <div>
                        <p class="label">
                            Blockchains
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total number of blockchains created on the AVA network</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">{{totalBlockchains}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/validators.png" />
                    <div>
                        <p class="label">
                            Validators
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total number of nodes participating in the consensus protocol of the AVA network</span>
                            </v-tooltip>
                        </p>

                        <p class="meta_val">{{totalValidators}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/ava_price.png" />
                    <div>
                        <p class="label">
                            Total Stake Amount
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method</span>
                            </v-tooltip>
                        </p>
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
