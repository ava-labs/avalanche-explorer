<template>
    <div class="content">
        <v-card flat>
            <v-card-text>
                <div class="subnet_header">
                    <div class="subheading">Subnetwork</div>
                    <h2>{{subnetID | subnet}}</h2>
                    <div class="stats">
                        <div class="bar">
                            <p
                                class="subnet_count"
                            >{{subnet.blockchains.length | pluralize}} validated by this subnet</p>
                        </div>
                    </div>
                </div>
                <v-tabs right show-arrows>
                    <v-tab>Blockchains ({{subnet.blockchains.length}})</v-tab>
                    <v-tab>Validators ({{subnet.validators.length}})</v-tab>
                    <v-tab>Pending Validators ({{subnet.pendingValidators.length}})</v-tab>
                    <v-tab>Control Keys ({{subnet.controlKeys.length}})</v-tab>
                    <v-tab-item class="tab_content">
                        <template v-if="subnet.blockchains.length === 0">
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
                                        <tr v-for="b in subnet.blockchains" :key="b.id">
                                            <td>
                                                <img
                                                    class="table_image"
                                                    src="@/assets/blockchain-purple.png"
                                                    alt
                                                />
                                                {{ b.name }}
                                            </td>
                                            <td class="id_overflow">{{ b.vmID }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content">
                        <template v-if="subnet.validators.length === 0">
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
                                        <tr v-for="v in subnet.validators" :key="v.id + v.stakeAmount">
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
                        <template v-if="subnet.pendingValidators.length === 0">
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
                                            v-for="v in subnet.pendingValidators"
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
                        <template v-if="subnet.controlKeys.length === 0">
                            <p class="null">There are no control keys for this subnet.</p>
                        </template>
                        <template v-else>
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Address of Control Key</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="ck in subnet.controlKeys" :key="ck">
                                            <td>
                                                <img
                                                    class="table_image"
                                                    src="@/assets/key-purple.png"
                                                    alt
                                                />
                                                {{ ck }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                            <p
                                class="threshold"
                            >{{subnet.threshold | pluralizeThreshold}} needed to add a validator to the subnet.</p>
                        </template>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { subnetMap } from "@/helper";
import Vue from "vue";

export default {
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
            fixedHeader: true
        };
    },
    props: {
        subnetID: String,
        subnet: {}
    }
};
</script>

<style scoped lang="scss">
@use '../../main';

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
    color: main.$black;

    .subheading {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 6px;
        /* opacity: 0.7; */
    }

    h2 {
        color: main.$primary-color;
        margin: 0 0 8px;
    }
}

.null {
    padding: 10px 0 0 16px;
    font-size: 0.75rem;
    font-weight: bold;
}

.threshold {
    padding: 32px 16px;
}

.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 8px;
    vertical-align: middle;
}

@include main.device_xs {
    .subnet_header {
        padding: 0;
    }
}
</style>

<style lang="scss">
@use '../../main';
.v-application .primary--text {
    color: main.$primary-color !important;
    caret-color: main.$primary-color !important;
}
</style>