<template>
    <v-card id="validator-data-table">
        <v-card-title>
            {{title}}
            <v-spacer></v-spacer>
            <v-switch v-model="absolute" :label="modeText"></v-switch>
            <!-- <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>-->
        </v-card-title>

        <v-data-table :items="validators" :headers="headers" multi-sort show-expand>
            <template #item.id="{item}">
                <div class="text-truncate" style="max-width: 100px;">{{item.id}}</div>
            </template>
            <template #item.stakeAmount="{item}">{{item.totalStakeAmount | AVAX}}</template>
            <template #item.startTime="{item}">
                <div class="text-right date no-pad-right">{{item.startTime.getTime() | date}}</div>
                <div class="text-right time no-pad-right">{{item.startTime.getTime() | time}}</div>
            </template>
            <template #item.elapsed="{item}">
                <div class="diagram-container" v-show="mode === 'absolute'">
                    <div class="diagram">
                        <div
                            class="chartbar"
                            v-bind:style="{
                                left: `${scale(item.startTime.getTime())}px`, 
                                width: `${scale(item.endTime.getTime()) - scale(item.startTime.getTime())}px`
                            }"
                        ></div>
                        <div
                            class="chartbar_complete"
                            v-bind:style="{
                                left: `${scale(item.startTime.getTime())}px`, 
                                width: `${scale(currentTime) - scale(item.startTime.getTime())}px`
                            }"
                        ></div>
                        <div class="now" v-bind:style="{left: `${scale(currentTime)}px`}"></div>
                    </div>
                </div>
                <div class="diagram-container" v-if="mode === 'relative'">
                    <div class="diagram">
                        <div
                            class="chartbar"
                            v-bind:style="{
                                left: `0px`, 
                                width: `${diagramWidth}px`
                            }"
                        ></div>
                        <div
                            class="chartbar_complete"
                            v-bind:style="{
                                left: `0px`, 
                                width: `${scaleRelative((((currentTime - (item.startTime.getTime())) / ((item.endTime.getTime()) - (item.startTime.getTime())))))}px`
                            }"
                        ></div>
                        <div
                            class="percentage_text text-right"
                            v-bind:style="{left: `71px`}"
                        >{{ item.elapsed }} %</div>
                    </div>
                </div>
            </template>
            <template #item.endTime="{item}">
                <div class="date">{{item.endTime.getTime() | date}}</div>
                <div class="time">{{item.endTime.getTime() | time}}</div>
            </template>
            <template #item.duration="{item}">
                {{(item.endTime - item.startTime) | duration}}
            </template>
            <template #item.delegators="{item}">
                <div
                    v-show="item.delegators && item.delegators.length>0"
                >{{(item.delegators.length)}}</div>
            </template>
            
            <!-- DELEGATOR EXPANDED ITEM -->
            <template #expanded-item="{headers, item}">
                <td :colspan="headers.length">
                    <tr v-for="delegator in item.delegators" :key="delegator.id">
                        <td style="width: 24px;"></td>
                        <td>
                            <div class="text-truncate delegator-label" style="width: 100px;">Delegator</div>
                        </td>
                        <td>
                            <div style="width: 130px">{{delegator.totalStakeAmount | AVAX}}</div>                            
                        </td>
                        <td style="width: 80px">
                            <div class="text-right date no-pad-right">{{delegator.startTime.getTime() | date}}</div>
                            <div class="text-right time no-pad-right">{{delegator.startTime.getTime() | time}}</div>
                        </td>
                        <td style="width: 125px">
                            <div class="diagram-container" v-show="mode === 'absolute'">
                                <div class="diagram">
                                    <div
                                        class="chartbar"
                                        v-bind:style="{
                                            left: `${scale(delegator.startTime.getTime())}px`, 
                                            width: `${scale(delegator.endTime.getTime()) - scale(delegator.startTime.getTime())}px`
                                        }"
                                    ></div>
                                    <div
                                        class="chartbar_complete"
                                        v-bind:style="{
                                            left: `${scale(delegator.startTime.getTime())}px`, 
                                            width: `${scale(currentTime) - scale(delegator.startTime.getTime())}px`
                                        }"
                                    ></div>
                                    <div
                                        class="now"
                                        v-bind:style="{left: `${scale(currentTime)}px`}"
                                    ></div>
                                </div>
                            </div>
                            <div class="diagram-container" v-if="mode === 'relative'">
                                <div class="diagram">
                                    <div
                                        class="chartbar"
                                        v-bind:style="{
                                            left: `0px`, 
                                            width: `${diagramWidth}px`
                                        }"
                                    ></div>
                                    <div
                                        class="chartbar_complete"
                                        v-bind:style="{
                                            left: `0px`, 
                                            width: `${scaleRelative((((currentTime - (delegator.startTime.getTime())) / ((delegator.endTime.getTime()) - (delegator.startTime.getTime())))))}px`
                                        }"
                                    ></div>
                                    <div
                                        class="percentage_text text-right"
                                        v-bind:style="{left: `71px`}"
                                    >{{ delegator.elapsed }} %</div>
                                </div>
                            </div>                            
                        </td>
                        <td style="width: 80px">
                            <div class="date">{{delegator.endTime.getTime() | date}}</div>
                            <div class="time">{{delegator.endTime.getTime() | time}}</div>
                        </td>
                        <td style="width: 85px">
                            {{(delegator.endTime - delegator.startTime) | duration}}
                        </td>
                        <td :colspan="headers.length">
                            <div>{{delegator.address}}</div>
                        </td>
                    </tr>
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { subnetMap, toAVAX } from "@/helper";
import moment from "moment";
import Subnet from "@/js/Subnet";
import { AVALANCHE_SUBNET_ID } from "@/store/modules/platform/platform";
import { IValidator } from "@/store/modules/platform/IValidator";
import ContentMetadata from "@/components/Subnets/ContentMetadata.vue";
import { scaleLinear } from "d3-scale";

@Component({
    components: {
        ContentMetadata,
    },
    filters: {
        AVAX(val: number) {
            return toAVAX(val);
        },
        duration(val: number) {
            return moment.duration(val).humanize();
        },
        date(val: number) {
            return moment(val).format("M/D/YYYY");
        },
        time(val: number) {
            return moment(val).format("h:mm:ss A");
        },
    },
})
export default class ValidatorDataTable extends Vue {
    defaultSubnetID: string = AVALANCHE_SUBNET_ID;
    currentTime: number | null = null;
    startTimes: number[] = [];
    endTimes: number[] = [];
    minTime: number = 0;
    maxTime: number = 1;
    absolute: boolean = false;
    diagramWidth: number = 125;
    expanded: any[] = [];

    @Prop() subnetID!: string;
    @Prop() subnet!: Subnet;
    @Prop() validators!: IValidator[];
    @Prop() title!: string;

    get headers(): any[] {
        return [
            { text: "Validator", value: "id", width: 100 },
            { text: "Stake", value: this.stakeOrWeight, width: 130 },
            { text: "Start", value: "startTime", align: "end", width: 80 },
            { text: "Completion", value: "elapsed", align: "center", width: 125 },
            { text: "End", value: "endTime", width: 80 },
            { text: "Duration", value: "duration", width: 85 },
            { text: "Payout Address", value: "address", width: 125 },
            { text: "Delgators", value: "delegators", width: 100 },
            { text: "", value: "expand", align: "end" },
        ];
    }

    get stakeOrWeight(): string {
        return this.subnetID === this.defaultSubnetID
            ? "stakeAmount"
            : "weight";
    }

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
        return Math.min(...startTimes);
    }

    maxEndTime() {
        let endTimes: number[] = [];
        this.subnet.validators.forEach((v: IValidator) => {
            endTimes.push(v.endTime.getTime());
        });
        return Math.max(...endTimes);
    }

    scale(val: number) {
        const scale = scaleLinear()
            .domain([this.minTime, this.maxTime])
            .range([0, this.diagramWidth]);
        return scale(val);
    }

    scaleRelative(val: number) {
        const scale = scaleLinear()
            .domain([0, 1])
            .range([0, this.diagramWidth]);
        return scale(val);
    }
}
</script>

<style scoped lang="scss">
@use "../../main";

#validator-data-table {
    margin-left: 1px;
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
    width: 125px;
}

.duration_text_container {
    margin-top: -20px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%;
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

.date {
    color: main.$gray;
    padding-top: 21px;
    line-height: 1em !important;
}

.time {
    color: main.$gray;
    font-size: 10px;
}

.pad {
    padding-top: 9px;
}

.no-pad-right {
    padding-right: 0 !important;
}

.no-pad-left {
    padding-left: 0 !important;
}

.text-truncate {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-top: 7px;
}

.delegator-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.0071428571em;
}

@include main.device_s {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include main.device_xs {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }
}
</style>

<style lang="scss">
@use "../../main";

#validator-data-table {

    .v-application .primary--text {
        color: main.$primary-color !important;
        caret-color: main.$primary-color !important;
    }

    .theme--light.v-tabs > .v-tabs-bar--show-arrows {
        background-color: main.$white !important;
    }

    .theme--light.v-tabs-items {
        margin-left: 1px;
    }

    .v-input--selection-controls .v-input__slot > .v-label,
    .v-input--selection-controls .v-radio > .v-label {
        width: 113px;
    }

    .v-data-table td,
    .v-data-table th {
        padding: 0 4px;

        &:first-of-type {
            padding-left: 16px;
        }

        &:last-of-type {
            padding-right: 16px;
        }
    }

    th {
        .v-input--selection-controls {
            padding-top: 0;
        }

        .v-label {
            font-size: 0.75rem;
        }

        .v-messages {
            display: none;
        }
    }
}

@include main.device_xs {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }
}
</style>