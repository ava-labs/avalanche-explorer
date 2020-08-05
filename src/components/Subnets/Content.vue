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
                            <ValidatorDataTable :validators="subnet.validators" :subnetID="subnetID" :subnet="subnet" :title="'Validators'"></ValidatorDataTable>
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content">
                        <template v-if="subnet.pendingValidators.length === 0">
                            <p class="null">There are no pending validators for this subnet.</p>
                        </template>
                        <template v-else>
                            <ValidatorDataTable :validators="subnet.pendingValidators" :subnetID="subnetID" :subnet="subnet" :title="'Pending Validators'"></ValidatorDataTable>
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content">
                        <template v-if="subnet.blockchains.length === 0">
                            <p class="null">There are no blockchains for this subnet.</p>
                        </template>
                        <template v-else>
                            <BlockchainDataTable :blockchains="subnet.blockchains" :title="'Blockchains'"></BlockchainDataTable>
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
import BlockchainDataTable from "@/components/Blockchain/BlockchainDataTable.vue";

@Component({
    components: {
        ContentMetadata,
        ValidatorDataTable,
        BlockchainDataTable
    },
    filters: {
        subnet(val: string) {
            return subnetMap(val);
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

.text-right {
    text-align: right !important;
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