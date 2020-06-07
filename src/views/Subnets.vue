<template>
    <div class="subnets">
        <div class="card meta_data_container">
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
         <div class="card"> 
            <template v-if="loading">Loading</template>
            <template v-else>
                <v-tabs vertical>
                    <v-tab v-for="(s, subnetID) in subnets" :key="s.id">{{subnetID | subnet}}</v-tab>
                    <v-tab-item v-for="(s, subnetID) in subnets" :key="s.id" :vertical="true">
                        <v-card flat>
                            <v-card-text>
                                <div class="subnet_header"></div>
                                <h2>{{subnetID | subnet}}</h2>
                                <div class="stats">
                                    <div class="bar">
                                        <p class="subnet_count">{{s.blockchains.length}} blockchains validated by this subnet</p>
                                    </div>
                                </div>
                                <v-tabs>
                                    <v-tab>Blockchains</v-tab>
                                    <v-tab>Validators</v-tab>
                                    <v-tab>Pending Validators</v-tab> 
                                    <v-tab-item class="tab_content">
                                        <v-simple-table>
                                            <template v-slot:default>
                                                <thead>
                                                    <tr>
                                                        <th class="text-left">Name</th>
                                                        <th class="text-left">Virtual Machine ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="b in s.blockchains" :key="b.id">
                                                        <td>{{ b.name }}</td>
                                                        <td class="id_overflow">{{ b.vmID }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-tab-item>
                                    <v-tab-item class="tab_content">
                                        <template v-if="s.validators.length === 0">
                                            <p>There are no validators for this subnet.</p>
                                        </template>
                                        <template v-else>
                                            <v-simple-table :dense="dense">
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">Validator</th>
                                                            <th class="text-left">Start Time</th>
                                                            <th class="text-left">End Time</th>
                                                            <th class="text-right">Stake</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="v in s.validators" :key="v.id">
                                                            <td class="id_overflow">{{v.id}}</td>
                                                            <td>{{ new Date(parseInt(v.startTime * 1000)).toLocaleString()}}</td>
                                                            <td>{{ new Date(parseInt(v.endTime * 1000)).toLocaleString()}}</td>
                                                            <td>{{ v.stakeAmount }}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </template>
                                    </v-tab-item>
                                    <v-tab-item class="tab_content">
                                        <template v-if="s.pendingValidators.length === 0">
                                            <p>There are no pending validators for this subnet.</p>
                                        </template>
                                        <template v-else>
                                            <v-simple-table :dense="dense">
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">Validator</th>
                                                            <th class="text-left">Start Time</th>
                                                            <th class="text-left">End Time</th>
                                                            <th class="text-right">Stake</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="v in s.pendingValidators" :key="v.id">
                                                            <td class="id_overflow">{{ v.id }}</td>
                                                            <td>{{ new Date(parseInt(v.startTime * 1000)).toLocaleString()}}</td>
                                                            <td>{{ new Date(parseInt(v.endTime * 1000)).toLocaleString()}}</td>
                                                            <td>{{ v.stakeAmount }}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </template>
                                    </v-tab-item>
                                </v-tabs>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </template>
         </div>
    </div>
</template>

<script>
import { ava } from "@/ava";
import { subnetMap } from "@/helper";
import Vue from "vue";

export default {
    filters: {
        subnet(val) {
            return subnetMap(val);
        }
    },
    data() {
        return {
            dense: true,
            fixedHeader: true,
            loading: true,
            blockchains: [],
            subnets: this.$store.state.Platform.subnets
        };
    },
    async created() {
        // get blockchains
        this.blockchains = await this.getBlockchains();
    },
    computed: {
        totalValidators() {
            return this.$store.getters["Platform/totalValidators"];
        },
        totalBlockchains() {
            return this.$store.getters["Platform/totalBlockchains"];
        },
        totalStake() {
            let valBig = this.$store.getters["Platform/totalStake"];
            let res = valBig.div(Math.pow(10, 9));
            return res;
        },
        totalSubnets() {
            return Object.keys(this.$store.state.Platform.subnets).length;
        }
    },
    methods: {
        async getBlockchains() {
            return await ava.apis.platform
                .getBlockchains()
                .then(res => {
                    this.loading = false;
                    return res;
                })
                .catch(error => console.log(error));
        }
    }
};
</script>

<style scoped lang="scss">
@use '../main';

.validators {
    background-color: #fff;
    border-radius: 6px;
    padding: 30px;
}

.validator {
    border-top: 1px solid #e7e7e7;

    &:nth-of-type(2n) {
        background-color: #f1f9ff;
    }
}

.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    font-size: 12px;
    font-weight: bold;

    p {
        padding: 12px 15px;
    }
}

.meta_data_container {
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
}

h3 {
    margin: 0;
}

.subnet_count {
    margin-top: 5px;
}

.bar {
    margin-bottom: 15px;
}

.tab_content {
    padding-top: 30px;
}

.id_overflow {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.v-tabs--vertical {
    margin-right: 30px;
}

.v-tabs--vertical > .v-tabs-bar {
    max-width: 200px !important;
}

.v-tabs--vertical > .v-tabs-bar .v-tab {
    width: 150px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    justify-content: flex-start;
    min-height: 48px;
    height: 30px;
    text-transform: none;
}

.v-card__text {
    padding-top: 0;
    padding-left: 30px;
    box-sizing: border-box;
    border-radius: 0 !important;
    margin-left: 30px;
    border-left: 1px solid #cecece;
}

.v-tab {
    font-weight: bold;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: #71c5ff !important;
}
</style>