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
                    <v-tab>Blockchains</v-tab>
                    <v-tab>Validators</v-tab>
                    <v-tab>Pending Validators</v-tab>
                    <v-tab>Control Keys</v-tab>
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
                            <div>
                                <p>Current: {{currentTime}}</p>
                                <p>Min: {{minTime}}</p>
                                <p>Max: {{maxTime}}</p>
                            </div>
                            <v-simple-table :dense="dense">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th>Validator</th>
                                            <th>Start Time</th>
                                            <th>Duration</th>
                                            <th>End Time</th>
                                            <template v-if="subnet.id === defaultSubnetID">
                                                <th>Stake</th>
                                            </template>
                                            <template v-else>
                                                <th>Weight</th>
                                            </template>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="v in subnet.validators" :key="v.id + v.stakeAmount">
                                            <td class="id_overflow">{{v.id}}</td>
                                            <td>
                                                <div>
                                                    {{new Date(parseInt(v.startTime * 1000)).toLocaleString()}}
                                                </div>
                                                <div>
                                                    {{scale(v.startTime.getTime() * 1000)}}
                                                </div>
                                            </td>
                                            <td>
                                                <div class="diagram">
                                                    <div v-bind:style="{
                                                        left: `${scale(v.startTime.getTime() * 1000)}px`, 
                                                        width: `${scale(v.endTime.getTime() * 1000) - scale(v.startTime.getTime() * 1000)}px`
                                                    }" class="bar"></div>
                                                </div>
                                                <div>
                                                    {{(v.endTime - v.startTime) * 1000}} | {{(v.endTime - v.startTime) * 1000 | duration}}
                                                </div>
                                                <div>
                                                    {{scale((v.endTime.getTime() - v.startTime) * 1000)}}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {{new Date(parseInt(v.endTime * 1000)).toLocaleString()}}
                                                </div>
                                                <div>
                                                    {{scale(v.endTime.getTime() * 1000)}}
                                                </div>
                                                
                                            </td>
                                            <template v-if="subnet.id === defaultSubnetID">
                                                <td>{{ v.stakeAmount | AVAX }}</td>
                                            </template>
                                            <template v-else>
                                                <td>{{ v.weight }}</td>
                                            </template>
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
                                            <template v-if="subnet.id === defaultSubnetID">
                                                <th class="text-right">Stake</th>
                                            </template>
                                            <template v-else>
                                                <th class="text-right">Weight</th>
                                            </template>
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
                                            <template v-if="subnet.id === defaultSubnetID">
                                                <td>{{ v.stakeAmount | AVAX }}</td>
                                            </template>
                                            <template v-else>
                                                <td>{{ v.weight }}</td>
                                            </template>
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
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { subnetMap, toAVAX } from "@/helper";
import moment from "moment";
import Subnet from '@/js/Subnet';
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform';
import { IValidator } from '@/store/modules/platform/IValidator';
import ContentMetadata from "@/components/Subnets/ContentMetadata.vue";
import { scaleLinear } from "d3-scale";

@Component({
    components: {
        ContentMetadata
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
    
    @Prop() subnetID!: string;
    @Prop() subnet!: Subnet;

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
        console.log("startTimes", startTimes);
        return Math.min(... startTimes) * 1000;
    }

    maxEndTime() {
        let endTimes: number[] = [];
        this.subnet.validators.forEach((v: IValidator) => {
            endTimes.push(v.endTime.getTime());
        });
        console.log("endTimes", endTimes);
        return Math.max(... endTimes) * 1000;
    }

    scale(val: number) {
        const scale = scaleLinear()
            .domain([this.minTime, this.maxTime])
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
}

.bar {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: main.$primary-color-light;
}

.text-right {
    text-align: right !important;
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
</style>