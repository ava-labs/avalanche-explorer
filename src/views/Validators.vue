<template>
    <div>
        <Metadata></Metadata>
        <div class="validators card">
            <StakingMetadata @toggle="handleToggle"></StakingMetadata>
            <div class="controls">
                <div class="filter_count">
                    <p v-show="search.length > 0 && matchedValidators">
                        {{
                            matchedValidators.length.toLocaleString()
                                | pluralize('result')
                        }}
                        found
                    </p>
                </div>
                <div class="filter_input_container">
                    <input
                        v-model="search"
                        class="filter"
                        type="text"
                        placeholder="Filter by Node ID"
                    />
                </div>
            </div>
            <div class="headers">
                <p>Rank</p>
                <p>
                    Node ID
                    <Tooltip
                        content="Node ID of validator participating in the consensus protocol"
                    ></Tooltip>
                </p>
                <p style="text-align: right">
                    <Tooltip
                        content="Amount of AVAX staked by this validator"
                    ></Tooltip
                    >Stake
                </p>
                <p v-if="$vuetify.breakpoint.smAndUp" style="text-align: right">
                    <Tooltip
                        content="Percentage of AVAX concentrated up to this validator ranking"
                    ></Tooltip
                    >Cumulative Stake
                </p>
            </div>
            <div v-if="validators.length === 0" class="empty_table">
                <p>No {{ toggle }} Validators</p>
            </div>
            <div v-show="search.length === 0">
                <div v-show="validators.length > 0">
                    <validator-row
                        v-for="v in paginatedValidators"
                        :key="v.nodeID + v.stakeAmount"
                        class="validator"
                        :validator="v"
                        :cumulative-stake="cumulativeStake[v.rank - 1]"
                    ></validator-row>
                </div>
            </div>
            <div v-show="search.length > 0">
                <validator-row
                    v-for="v in matchedValidators"
                    :key="v.nodeID + v.stakeAmount"
                    class="validator"
                    :validator="v"
                    :cumulative-stake="cumulativeStake[v.rank - 1]"
                ></validator-row>
            </div>
            <div v-show="search.length === 0" class="pagination_container">
                <validator-pagination-controls
                    :total="totalValidatorsCount"
                    :limit="limit"
                    @change="handleChange"
                ></validator-pagination-controls>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import ValidatorRow from '@/components/rows/ValidatorRow/ValidatorRow.vue'
import ValidatorPaginationControls from '@/components/misc/ValidatorPaginationControls.vue'
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform'
import Tooltip from '@/components/rows/Tooltip.vue'
import Metadata from '@/components/Validators/Metadata.vue'
import StakingMetadata from '@/components/Validators/StakingMetadata.vue'
import { IValidator } from '@/store/modules/platform/IValidator'

@Component({
    components: {
        Tooltip,
        ValidatorRow,
        ValidatorPaginationControls,
        Metadata,
        StakingMetadata,
    },
})
export default class Validators extends Vue {
    search = ''
    toggle = 'active' // active | pending
    limit = 25 // how many rows to display
    start = 0

    matchSearch(val: HTMLInputElement) {
        if (this.search) {
            const idUpper = val.id.toUpperCase()
            const queryUpper = this.search.toUpperCase()
            if (!idUpper.includes(queryUpper)) {
                return false
            }
        }
        return true
    }

    handleChange(val: number) {
        this.start = val // all computed values will react to change
    }

    handleToggle(val: string) {
        this.toggle = val
    }

    get totalStake() {
        const valBig =
            this.toggle === 'active'
                ? this.$store.getters['Platform/totalStake']
                : this.$store.getters['Platform/totalPendingStake']
        return valBig.div(Math.pow(10, 9)).toLocaleString()
    }

    get totalValidatorsCount() {
        return this.toggle === 'active'
            ? this.$store.getters['Platform/totalValidators']
            : this.$store.getters['Platform/totalPendingValidators']
    }

    get validators() {
        const defaultSubnet = this.$store.state.Platform.subnets[
            AVALANCHE_SUBNET_ID
        ]
        if (defaultSubnet) {
            return this.toggle === 'active'
                ? defaultSubnet.validators
                : defaultSubnet.pendingValidators
        }
        return []
    }

    get matchedValidators() {
        return this.validators
            .filter((v: IValidator) => v.nodeID.includes(this.search))
            .slice(0, 10)
    }

    get paginatedValidators() {
        return this.validators.slice(this.start, this.start + this.limit)
    }

    get pendingValidators() {
        const defaultSubnet = this.$store.state.Platform.subnets[
            AVALANCHE_SUBNET_ID
        ]
        if (defaultSubnet) {
            const vals = defaultSubnet.pendingValidators
            return vals
        }
        return []
    }

    get cumulativeStake() {
        const defaultSubnet = this.$store.state.Platform.subnets[
            AVALANCHE_SUBNET_ID
        ]
        if (defaultSubnet) {
            return this.toggle === 'active'
                ? this.$store.getters['Platform/cumulativeStake']
                : this.$store.getters['Platform/cumulativePendingStake']
        }
        return []
    }
}
</script>
<style scoped lang="scss">
.pagination_container {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
}

.validators {
    background-color: $white;
    border-radius: 6px;
    padding: 30px;
}

.validator {
    border-top: 1px solid #e7e7e7;

    &:nth-of-type(2n) {
        background-color: $secondary-color-xlight;
    }
}

.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    color: $black;
    font-size: 12px;
    font-weight: 700;

    p {
        padding: 12px 15px;
    }
}

.empty_table {
    text-align: center;
    padding: 30px;
    opacity: 0.7;
    font-size: 12px;
}

@include smOnly {
    .header {
        flex-direction: column;
    }

    .controls {
        margin-bottom: 12px;

        .search_container {
            display: flex;
            flex-direction: column;

            .search_count {
                padding-top: 5px;
            }

            .search_tabs {
                flex-direction: column;
                justify-content: flex-end;
                align-items: baseline;
                margin-bottom: 0;
                width: 100%;
            }

            .search {
                width: 100%;
                margin: 20px 0 5px;
            }
        }
    }

    .pagination_container {
        justify-content: center;
    }
}

@include xsOnly {
    .validators {
        padding: 30px 15px;
    }

    .controls {
        margin-bottom: 12px;

        .search_container {
            .search {
                margin: 15px 0 0;
            }
        }
    }

    .pagination_container {
        margin-top: 15px;
    }

    .headers {
        grid-template-columns: 42px 1fr 1fr 0.5fr;
        font-size: 11px;

        p {
            padding: 12px 15px 12px 0;
        }

        &:first-child {
            text-align: left;
        }
    }
}
</style>
