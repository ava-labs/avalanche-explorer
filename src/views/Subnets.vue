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
                        <p class="count">{{Object.keys(uniqueSubnets).length}} subnets found</p>
                        <p class="count">{{Object.keys(blockchains).length}} blockchains found</p>
                    </div>
                </template>
            </div>
            <template v-if="loading">Loading</template>
            <template v-else>
                <div v-for="b in blockchains" :key="b.id">
                    <h3>{{b.name}}</h3>
                    <p>id: {{b.id}}</p>
                    <p>subnet id: {{b.subnetID}}</p>
                    <p>vm id: {{b.vmID}}</p>
                    <p>status: {{b.status}}</p>
                    <p>validators: {{b.validators}}</p>
                    <p>pending validators: {{b.pendingValidators}}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { ava } from "@/ava";

export default {
    components: {},
    data() {
        return {
            loading: true,
            blockchains: [],
            uniqueSubnets: []
        };
    },
    async created() {
        // get blockchains
        this.blockchains = await this.getBlockchains();
        this.addBlockchainData();
        this.addPChain();
        // group blockchains by subnet
        this.uniqueSubnets = this.getUniqueSubnets(this.blockchains);
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
                vmID: "???",
            }
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
        getUniqueSubnets(blockchains) {
            return [...new Set(blockchains.map(b => b.subnetID))];
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

.card {
    background-color: #fff;
    border-radius: 6px;
    padding: 15px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>