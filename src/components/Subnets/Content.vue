<template>
    <div class="content">
        <v-card flat>
            <v-card-text>
                <div class="subnet_header">
                    <div class="subheading">Subnetwork</div>
                    <h2>{{subnetID | subnet}}</h2>
                </div>
                <ContentMetadata
                    :totalBlockchains="subnet.blockchains.length"
                    :totalValidators="subnet.validators.length"
                    :totalPendingValidators="subnet.pendingValidators.length"
                    :totalControlKeys="subnet.controlKeys.length"
                ></ContentMetadata>
                <v-tabs show-arrows>
                    <v-tab>Validators</v-tab>
                    <v-tab>Pending Validators</v-tab>
                    <v-tab>Blockchains</v-tab>
                    <v-tab>Control Keys</v-tab>
                    <v-tab-item class="tab_content">
                        <template v-if="subnet.validators.length === 0">
                            <p class="null">There are no validators for this subnet.</p>
                        </template>
                        <template v-else>
                            <ValidatorDataTable :validators="subnet.validators" :subnetID="subnetID" :subnet="subnet"></ValidatorDataTable>
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
                                            <th class="pad">Validator</th>
                                            <template v-if="subnet.id === defaultSubnetID">
                                                <th class="pad">Stake</th>
                                            </template>
                                            <template v-else>
                                                <th class="pad">Weight</th>
                                            </template>
                                            <th class="text-right pad">Start Time</th>
                                            <th><v-switch v-model="absolute" :label="modeText"></v-switch></th>
                                            <th class="pad">End Time</th>
                                            <th class="pad">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="v in subnet.pendingValidators" :key="v.id + v.stakeAmount">
                                            <td class="id_overflow">{{v.id}}</td>
                                            <template v-if="subnet.id === defaultSubnetID">
                                                <td>{{ v.stakeAmount | AVAX }}</td>
                                            </template>
                                            <template v-else>
                                                <td>{{ v.weight }}</td>
                                            </template>
                                            <td class="text-right date">{{new Date(v.startTime).toLocaleString()}}</td>
                                            <template v-if="mode === 'absolute'">
                                                <td class="diagram-container">
                                                    <div class="diagram">
                                                        <div class="chartbar" 
                                                        v-bind:style="{
                                                            left: `${scale(v.startTime.getTime())}px`, 
                                                            width: `${scale(v.endTime.getTime()) - scale(v.startTime.getTime())}px`
                                                        }"></div>
                                                        <div class="chartbar_complete" 
                                                        v-bind:style="{
                                                            left: `${scale(v.startTime.getTime())}px`, 
                                                            width: `${scale(currentTime) - scale(v.startTime.getTime())}px`
                                                        }"></div>
                                                        <div class="now" v-bind:style="{left: `${scale(currentTime)}px`}"></div>
                                                    </div>
                                                </td>
                                            </template>
                                            <template v-if="mode === 'relative'">
                                                <td class="diagram-container">
                                                    <div class="diagram">
                                                        <div class="chartbar" 
                                                        v-bind:style="{
                                                            left: `0px`, 
                                                            width: `200px`
                                                        }"></div>
                                                        <div class="chartbar_complete" 
                                                        v-bind:style="{
                                                            left: `0px`, 
                                                            width: `${
                                                                scaleRelative(
                                                                    ((
                                                                    (currentTime - (v.startTime.getTime())) / 
                                                                    ((v.endTime.getTime()) - (v.startTime.getTime()))
                                                                ))
                                                                )
                                                            }px`
                                                        }"></div>
                                                        <div class="percentage_text text-right" v-bind:style="{left: `146px`}"> 
                                                        {{  (((currentTime - (v.startTime.getTime())) / 
                                                        ((v.endTime.getTime()) - (v.startTime.getTime()))) 
                                                        * 100).toFixed(0) }} %</div>
                                                    </div>
                                                </td>
                                            </template>
                                            <td class="date">{{new Date(v.endTime).toLocaleString()}}</td>
                                            <td>{{(v.endTime - v.startTime) | duration}}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </template>
                    </v-tab-item>
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
                            <p class="threshold">{{subnet.threshold | pluralizeThreshold}} needed to add a validator to the subnet.</p>
                        </template>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { subnetMap, toAVAX } from "@/helper";
import moment from "moment";
import Subnet from '@/js/Subnet';
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform';
import { IValidator } from '@/store/modules/platform/IValidator';
import ContentMetadata from "@/components/Subnets/ContentMetadata.vue";
import { scaleLinear } from "d3-scale";
import ValidatorDataTable from "@/components/Validators/ValidatorDataTable.vue";

@Component({
    components: {
        ContentMetadata,
        ValidatorDataTable
    },
    filters: {
        subnet(val: string) {
            return subnetMap(val);
        },
        pluralize(val: number) {
            return val === 0
                ? `${val} blockchains`
                : val > 1
                ? `${val} blockchains`
                : `${val} blockchain`;
        },
        pluralizeThreshold(val: number) {
            return val === 0
                ? `${val} threshold signatures from addresses are`
                : val > 1
                ? `${val} threshold signatures from addresses are`
                : `${val} threshold signature from address is`;
        },
        AVAX(val: number) {
            return toAVAX(val);
        },
        duration(val: number) {
            return moment.duration(val).humanize();
        },
        date(val: number) {
            return moment(val).format("D/M/YYYY"); 
        },
        time(val: number) {            
            return moment(val).format("h:mm:ss A");
        }
    }
})
export default class Content extends Vue {
    dense: boolean = true;
    fixedHeader: boolean = true;
    defaultSubnetID: string = AVALANCHE_SUBNET_ID;
    currentTime: number | null = null;
    startTimes: number[] = [];
    endTimes: number[] = [];
    minTime: number = 0;
    maxTime: number = 1;
    absolute: boolean = false;
    
    @Prop() subnetID!: string;
    @Prop() subnet!: Subnet;

    get mode(): string {
        return this.absolute ? "absolute" : "relative";
    }

    get modeText() {
        return this.absolute ? "Timeline" : "Completion";
    }

    created() {
        let now = new Date();
        this.currentTime = now.getTime();
        this.minTime = this.minStartTime();
        this.maxTime = this.maxEndTime();
    }

    minStartTime() {
        let startTimes: number[] = [];
        this.subnet.validators.forEach((v: IValidator) => {
            startTimes.push(v.startTime.getTime());
        });
        return Math.min(... startTimes);
    }

    maxEndTime() {
        let endTimes: number[] = [];
        this.subnet.validators.forEach((v: IValidator) => {
            endTimes.push(v.endTime.getTime());
        });
        return Math.max(... endTimes);
    }

    scale(val: number) {
        const scale = scaleLinear()
            .domain([this.minTime, this.maxTime])
            .range([0, 200]);
        return scale(val);    
    }

    scaleRelative(val: number) {
        const scale = scaleLinear()
            .domain([0, 1])
            .range([0, 200]);
        return scale(val);    
    }
}
</script>

<style scoped lang="scss">
@use "../../main";

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
    font-weight: 400; /* 700 */
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: main.$primary-color !important;
}

.subnet_header {
    color: main.$black;

    .subheading {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: 400; /* 700 */
    }

    h2 {
        color: main.$primary-color;
        margin: 0;
        padding-top: 0;
    }
}

.null {
    padding: 10px 0 0 16px;
    font-size: 0.75rem;
    font-weight: 400; /* 700 */
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

.diagram {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    height: 20px;
    position: relative;
    border-left: 1px solid main.$primary-color-light;
    border-right: 1px solid main.$primary-color-light;
}

.chartbar {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: main.$primary-color-light;
}

.chartbar_complete {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: main.$primary-color;
    opacity: 0.5;
}

.text-right {
    text-align: right !important;
}

.diagram-container {
    width: 200px;
}

.duration_text_container {
    margin-top: -20px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%
}

.now {
    position: absolute;
    top: -11px;
    font-size: 12px;
    background-color: main.$primary-color;
    height: calc(100% + 22px);
    width: 1px;
    z-index: 5;
}

.percentage_text {
    position: absolute;
    text-align: right;
    top: 0;
    width: 50px;
    color: main.$black;
    font-size: 12px;
    z-index: 3;
}

.pad {
    padding-top: 9px;
}

@include main.device_s {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include main.device_xs {
    .subnet_header {
        padding: 0;
    }
}
</style>

<style lang="scss">
@use "../../main";
.v-application .primary--text {
    color: main.$primary-color !important;
    caret-color: main.$primary-color !important;
}

.theme--light.v-tabs > .v-tabs-bar--show-arrows {
    background-color: main.$white !important;
}

th {
    .v-input__slot {
        /* margin-bottom: 0; */
    }
    .v-input--selection-controls {
        /* margin-top: 0; */
        padding-top: 0;
    }
    .v-label {
        font-size: 0.75rem;
    }

    .v-messages {
        display: none;
    }
}
</style>