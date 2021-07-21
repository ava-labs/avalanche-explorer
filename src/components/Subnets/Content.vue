<template>
    <div id="content">
        <v-card flat>
            <v-card-text>
                <div class="subnet_header">
                    <div class="subheading">Subnetwork</div>
                    <h2>{{ subnetID | subnet }}</h2>
                </div>
                <ContentMetadata
                    :total-blockchains="subnet.blockchains.length"
                    :total-validators="subnet.validators.length"
                    :total-delegators="subnet.delegators.length"
                    :total-control-keys="subnet.controlKeys.length"
                />
                <v-tabs v-model="tab" show-arrows>
                    <v-tab href="#validators">Validators</v-tab>
                    <v-tab href="#pending-validators">Pending Validators</v-tab>
                    <v-tab href="#blockchains">Blockchains</v-tab>
                    <v-tab href="#control-keys">Control Keys</v-tab>
                    <v-tab href="#delegations">Delegations</v-tab>
                    <v-tab-item class="tab_content" value="validators">
                        <template v-if="subnet.validators.length === 0">
                            <p class="null">
                                There are no validators for this subnet.
                            </p>
                        </template>
                        <template v-else>
                            <ValidatorDataTable
                                :validators="subnet.validators"
                                :subnet-i-d="subnetID"
                                :subnet="subnet"
                                :title="'Validators'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="pending-validators">
                        <template v-if="subnet.pendingValidators.length === 0">
                            <p class="null">
                                There are no pending validators for this subnet.
                            </p>
                        </template>
                        <template v-else>
                            <ValidatorDataTable
                                :validators="subnet.pendingValidators"
                                :subnet-i-d="subnetID"
                                :subnet="subnet"
                                :title="'Pending Validators'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="blockchains">
                        <template v-if="subnet.blockchains.length === 0">
                            <p class="null">
                                There are no blockchains for this subnet.
                            </p>
                        </template>
                        <template v-else>
                            <BlockchainDataTable
                                :blockchains="subnet.blockchains"
                                :title="'Blockchains'"
                                :links="true"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="control-keys">
                        <template v-if="subnet.controlKeys.length === 0">
                            <p class="null">
                                There are no control keys for this subnet.
                            </p>
                        </template>
                        <template v-else>
                            <ControlKeyTable
                                :subnet="subnet"
                                :title="'Control Keys'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="delegations">
                        <template v-if="subnet.delegators.length === 0">
                            <p class="null">
                                There are no delegated stakes for this subnet.
                            </p>
                        </template>
                        <template v-else>
                            <DelegationDataTable
                                :validators="subnet.delegators"
                                :subnet-i-d="subnetID"
                                :subnet="subnet"
                                :title="'Delegations'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Subnet from '@/js/Subnet'
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform'
import ContentMetadata from '@/components/Subnets/ContentMetadata.vue'
import ValidatorDataTable from '@/components/Validators/ValidatorDataTable.vue'
import BlockchainDataTable from '@/components/Blockchain/BlockchainDataTable.vue'
import DelegationDataTable from '@/components/Validators/DelegationDataTable.vue'
import ControlKeyTable from '@/components/Validators/ControlKeyTable.vue'

@Component({
    components: {
        ContentMetadata,
        ValidatorDataTable,
        BlockchainDataTable,
        ControlKeyTable,
        DelegationDataTable,
    },
})
export default class Content extends Vue {
    dense = true
    fixedHeader = true
    defaultSubnetID: string = AVALANCHE_SUBNET_ID
    currentTime: number | null = null
    startTimes: number[] = []
    endTimes: number[] = []
    minTime = 0
    maxTime = 1
    absolute = false

    @Prop() subnetID!: string
    @Prop() subnet!: Subnet

    get mode(): string {
        return this.absolute ? 'absolute' : 'relative'
    }

    get modeText() {
        return this.absolute ? 'Timeline' : 'Completion'
    }

    get tab() {
        return this.$route.query.tab
    }

    set tab(tab: string | (string | null)[]) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
    }
}
</script>

<style scoped lang="scss">
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
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: $primary-color !important;
}

.subnet_header {
    color: $black;

    .subheading {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: 400;
    }

    h2 {
        color: $primary-color;
        margin: 0;
        padding-top: 0;
    }
}

.null {
    padding: 10px 0 0 16px;
    font-size: 0.75rem;
    font-weight: 400;
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
    width: 100%;
}

.now {
    position: absolute;
    top: -11px;
    font-size: 12px;
    background-color: $primary-color;
    height: calc(100% + 22px);
    width: 1px;
    z-index: 5;
}

.percentage_text {
    position: absolute;
    text-align: right;
    top: 0;
    width: 50px;
    color: $black;
    font-size: 12px;
    z-index: 3;
}

.pad {
    padding-top: 9px;
}

@include smOnly {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include xsOrSmaller {
    .subnet_header {
        padding: 0;
    }
}
</style>

<style lang="scss">
.v-application .primary--text {
    color: $primary-color !important;
    caret-color: $primary-color !important;
}

.theme--light.v-tabs > .v-tabs-bar--show-arrows {
    background-color: $white !important;
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

#content {
    .table_margin {
        margin-left: 1px;
    }

    a.v-tab {
        display: flex;

        &:hover {
            text-decoration: none;
        }
    }
}
</style>
