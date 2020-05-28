<template>
    <div class="subnets">
        <div class="card">
            <div class="header">
                <v-tooltip bottom left>
                    <template v-slot:activator="{ on }">
                        <h2 v-on="on">Subnet Overview</h2>
                    </template>
                    <span>
                        A Subnet is a set of validators. A Subnet validates a set of blockchains.
                        <br />Each blockchain is validated by exactly one Subnet, which is specified on blockchain creation.
                    </span>
                </v-tooltip>
                <template v-if="loading">Loading</template>
                <template v-else>
                    <div class="bar">
                        <p class="count">{{Object.keys(subnets).length}} subnets found</p>
                        <p class="count">{{Object.keys(blockchains).length}} blockchains found</p>
                    </div>
                </template>
            </div>
            <template v-if="loading">Loading</template>
            <template v-else>
                <v-tabs vertical>
                    <v-tab v-for="s in subnets" :key="s.id">{{s.id | subnet}}</v-tab>
                    <v-tab-item v-for="s in subnets" :key="s.id">
                        <v-card flat>
                            <v-card-text>
                                <h2>{{s.id | subnet}}</h2>
                                <div class="stats">
                                    <div class="bar">
                                        <p class="count">{{s.chains.length}} blockchains found for this subnet</p>
                                    </div>
                                </div>
                                <v-tabs>
                                    <v-tab>Blockchains</v-tab>
                                    <v-tab>Validators</v-tab>
                                    <v-tab>Pending Validators</v-tab>
                                    <v-tab-item>
                                        <v-simple-table>
                                            <template v-slot:default>
                                                <thead>
                                                    <tr>
                                                        <th class="text-left">Name</th>
                                                        <th class="text-left">Tx ID</th>
                                                        <th class="text-left">vmID</th>
                                                        <th class="text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="b in s.chains" :key="b.id">
                                                        <td>{{ b.name }}</td>
                                                        <td>{{ b.id }}</td>
                                                        <td>{{ b.vmID }}</td>
                                                        <td>{{ b.status }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-simple-table>
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
                                                    <tr
                                                        v-for="v in s.chains[0].validators"
                                                        :key="v.id"
                                                    >
                                                        <td>
                                                            <router-link :to="`/tx/${b.id}`" class="id">{{b.id}}...</router-link>
                                                            {{ v.id }}
                                                            </td>
                                                        <td>{{ new Date(parseInt(v.startTime)) }}</td>
                                                        <td>{{ new Date(parseInt(v.endTime)) }}</td>
                                                        <td>{{ v.stakeAmount }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-simple-table>
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
                                                    <tr
                                                        v-for="v in s.chains[0].pendingValidators"
                                                        :key="v.id"
                                                    >
                                                        <td>{{ v.id }}</td>
                                                        <td>{{ new Date(parseInt(v.startTime)) }}</td>
                                                        <td>{{ new Date(parseInt(v.endTime)) }}</td>
                                                        <td>{{ v.stakeAmount }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
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

export default {
    filters: {
        subnet(val) {
            return subnetMap(val);
        }
    },
    data() {
        return {
            loading: true,
            blockchains: [],
            subnets: []
        };
    },
    async created() {
        // get blockchains
        this.blockchains = await this.getBlockchains();
        this.addBlockchainData();
        this.addPChain();
        // group blockchains by subnet
        this.subnets = this.getSubnets(this.blockchains);
        this.subnets = this.getChainsBySubnet(
            this.subnets,
            this.blockchains
        );
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
        },
        async addBlockchainData() {
            this.blockchains.forEach(async b => {
                await Promise.all([
                    this.getBlockchainStatus(b.id),
                    this.getCurrentValidators(b.subnetID),
                    this.getPendingValidators(b.subnetID)
                ]).then(values => {
                    b.status = values[0];
                    b.validators = values[1];
                    b.pendingValidators = values[2];
                    // rerender hack
                    let id = b.id;
                    b.id = "";
                    b.id = id;
                });
            });
        },
        async addPChain() {
            let pChain = {
                name: "P-Chain",
                id: "11111111111111111111111111111111LpoYY",
                subnetID: "11111111111111111111111111111111LpoYY",
                vmID: "???"
            };
            await Promise.all([
                this.getBlockchainStatus(pChain.id),
                this.getCurrentValidators(pChain.subnetID),
                this.getPendingValidators(pChain.subnetID)
            ]).then(values => {
                pChain.status = values[0];
                pChain.validators = values[1];
                pChain.pendingValidators = values[2];
            });
            this.blockchains.push(pChain);
        },
        getBlockchainStatus(id) {
            return ava.apis.platform
                .getBlockchainStatus(id)
                .then(res => res)
                .catch(error => console.log(error));
        },
        getCurrentValidators(subnetID) {
            return ava.apis.platform
                .getCurrentValidators(subnetID)
                .then(res => res)
                .catch(error => console.log(error));
        },
        getPendingValidators(subnetID) {
            return ava.apis.platform
                .getPendingValidators(subnetID)
                .then(res => res)
                .catch(error => console.log(error));
        },
        getSubnets(blockchains) {
            return [...new Set(blockchains.map(b => b.subnetID))];
        },
        getChainsBySubnet(subnets, blockchains) {
            return subnets.map(s => {
                return {
                    id: s,
                    chains: blockchains.filter(b => b.subnetID === s)
                };
            });
        }
    }
};
</script>

<style scoped lang="scss">
@use '../main';

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;

    h2 {
        font-size: 18px;
        margin: 0;
    }

    .count {
        padding-top: 5px;
        color: #808080;
        font-size: 12px;
    }
}

h2,
h3 {
    margin: 0;
}

.flex_wrapper {
    display: flex;
}

.flex_left {
    width: 500px;
    background-color: rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.1);
    margin-right: 30px;
}

.card {
    background-color: #fff;
    border-radius: 6px;
    padding: 30px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>