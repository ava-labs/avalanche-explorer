<template>
    <div class="subnets">
        <Metadata
            :totalSubnets="totalSubnets"
            :totalValidators="totalValidators"
            :totalBlockchains="totalBlockchains"
            :totalStake="totalStake"
        ></Metadata>
        <div class="card">
            <template v-if="loading">Loading</template>
            <template v-else>
                <v-tabs vertical right>
                    <v-tab v-for="(s, subnetID) in subnets" :key="s.id">{{subnetID | subnet}}</v-tab>
                    <v-tab-item
                        v-for="(s, subnetID) in subnets"
                        :key="s.id"
                        :vertical="true"
                        class="fart"
                    >
                        <v-card flat>
                            <v-card-text>
                                <div class="subnet_header">
                                    <div class="subheading">Subnetwork</div>
                                    <h2>{{subnetID | subnet}}</h2>
                                    <div class="stats">
                                        <div class="bar">
                                            <p class="subnet_count">{{s.blockchains.length | pluralize}} validated by this subnet</p>
                                        </div>
                                    </div>
                                </div>
                                <v-tabs right show-arrows>
                                    <v-tab>Blockchains ({{s.blockchains.length}})</v-tab>
                                    <v-tab>Validators ({{s.validators.length}})</v-tab>
                                    <v-tab>Pending Validators ({{s.pendingValidators.length}})</v-tab>
                                    <v-tab>Control Keys ({{s.controlKeys.length}})</v-tab>
                                    <v-tab-item class="tab_content">
                                        <template v-if="s.blockchains.length === 0">
                                            <p class="null">There are no blockchains for this subnet.</p>
                                        </template>
                                        <template v-else>
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
                                        </template>
                                    </v-tab-item>
                                    <v-tab-item class="tab_content">
                                        <template v-if="s.validators.length === 0">
                                            <p class="null">There are no validators for this subnet.</p>
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
                                                        <tr
                                                            v-for="v in s.validators"
                                                            :key="v.id + v.stakeAmount"
                                                        >
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
                                            <p class="null">There are no pending validators for this subnet.</p>
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
                                                        <tr
                                                            v-for="v in s.pendingValidators"
                                                            :key="v.id + v.stakeAmount"
                                                        >
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
                                    <v-tab-item class="tab_content">
                                        <template v-if="s.controlKeys.length === 0">
                                            <p class="null">There are no control keys for this subnet.</p>
                                        </template>
                                        <template v-else>
                                            <v-simple-table>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                class="text-left"
                                                            >Address of Control Key</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="ck in s.controlKeys" :key="ck">
                                                            <td>{{ ck }}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                            <p class="threshold">{{s.threshold | pluralizeThreshold}} needed to add a validator to the subnet.</p>
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
import Metadata from "../components/Subnets/Metadata";

export default {
    components: {
        Metadata
    },
    filters: {
        subnet(val) {
            return subnetMap(val);
        },
        pluralize(val) {
            return val === 0
                ? `${val} blockchains`
                : val > 1
                ? `${val} blockchains`
                : `${val} blockchain`;
        },
        pluralizeThreshold(val) {
            return val === 0
                ? `${val} threshold signatures from addresses are`
                : val > 1
                ? `${val} threshold signatures from addresses are`
                : `${val} threshold signature from address is`;
        }
    },
    data() {
        return {
            dense: true,
            fixedHeader: true,
            loading: true,
            blockchains: []
        };
    },
    async created() {
        this.blockchains = await this.getBlockchains();
        console.log("blah", this.$vuetify.breakpoint.mdAndUp);
    },
    computed: {
        subnets() {
            const subnets = this.$store.state.Platform.subnets;
            const ordered = {};
            Object.keys(subnets)
                .sort()
                .forEach(key => (ordered[key] = subnets[key]));
            return ordered;
        },
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
    padding-top: 15px;
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
    box-sizing: border-box;
    border-radius: 0 !important;
    padding-left: 16px;
}

.v-tab {
    font-weight: bold;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: main.$primary-color !important;
}

.subnet_header {
    
    padding: 13px 0 0 16px;

    .subheading {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 6px;
        opacity: 0.7;
    }
    
    h2 {
        margin: 0 0 8px;
    }
}

.null {
    padding: 10px 0 0 16px;
    font-size: .75rem;
    font-weight: bold;
}

.threshold {
    padding: 32px 16px;
}

@include main.device_xs {
    .subnet_header {
        padding: 0;
    }
}
</style>

<style lang="scss">
.v-tabs--vertical > .v-tabs-bar {
    max-width: 200px !important;
    padding-right: 30px;
    border-right: 1px solid #cecece;
}

.v-tabs--vertical > .v-window {
    overflow: scroll !important;
}
</style>