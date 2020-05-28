<template>
    <div class="subnets">
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
                    <v-tab-item v-for="s in subnets" :key="s.id" :vertical="true">
                        <v-card flat>
                            <v-card-text>
                                <div class="subnet_header"></div>
                                <h2>{{s.id | subnet}}</h2>
                                <div class="stats">
                                    <div class="bar">
                                        <p
                                            class="subnet_count"
                                        >{{s.blockchains.length}} blockchains validated by this subnet</p>
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
                                                        <th class="text-left">Genesis Tx ID</th>
                                                        <th class="text-left">Virtual Machine ID</th>
                                                        <th class="text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="b in s.blockchains" :key="b.id">
                                                        <td>{{ b.name }}</td>
                                                        <td class="id_overflow">{{ b.id }}</td>
                                                        <td class="id_overflow">{{ b.vmID }}</td>
                                                        <td>{{ b.status }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-tab-item>
                                    <v-tab-item>
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
                                                    <tr
                                                        v-for="v in s.blockchains[0].validators"
                                                        :key="v.id"
                                                    >
                                                        <td class="id_overflow">{{v.id}}</td>
                                                        <td>{{ new Date(parseInt(v.startTime * 1000)).toLocaleString()}}</td>
                                                        <td>{{ new Date(parseInt(v.endTime * 1000)).toLocaleString()}}</td>
                                                        <td>{{ v.stakeAmount }}</td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-tab-item>
                                    <v-tab-item>
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
                                                    <tr
                                                        v-for="v in s.blockchains[0].pendingValidators"
                                                        :key="v.id"
                                                    >
                                                        <td class="id_overflow">{{ v.id }}</td>
                                                        <td>{{ new Date(parseInt(v.startTime * 1000)).toLocaleString()}}</td>
                                                        <td>{{ new Date(parseInt(v.endTime * 1000)).toLocaleString()}}</td>
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
            dense: true,
            fixedHeader: true,
            loading: true,
            blockchains: [],
            subnets: []
        };
    },
    async created() {
        // get blockchains
        this.blockchains = await this.getBlockchains();
        this.addBlockchainData();
        await this.addPChain();
        // group blockchains by subnet
        this.subnets = this.getSubnets(this.blockchains);
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
            let subnets = [...new Set(blockchains.map(b => b.subnetID))];
            return subnets.map(s => {
                return {
                    id: s,
                    blockchains: blockchains.filter(b => b.subnetID === s)
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

.subnet_count {
    margin-top: 5px;
}

.bar {
    margin-bottom: 15px;
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

.card {
    background-color: #fff;
    border-radius: 6px;
    padding: 30px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>