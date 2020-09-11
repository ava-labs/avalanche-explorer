<template>
    <div class="blockchain">
        <Metadata @toggle="handleToggle"></Metadata>
        <div class="validators card">
            <div class="header">
                <h2>Staking Distribution</h2>
            </div>
            <div class="controls">
                <div class="filter_count">
                    <p v-show="search.length === 0">
                        {{totalValidatorsCount.toLocaleString()}} {{toggle}} validators</p>
                    <p v-show="search.length > 0 && matchedValidators">
                        {{matchedValidators.length.toLocaleString() | pluralize}} found</p>
                </div>
                <div class="filter_input_container">    
                    <input
                        class="filter"
                        type="text"
                        v-model="search"
                        placeholder="Filter by Node ID"
                    />
                </div>
            </div>
            <div class="headers">
                <p>Rank</p>
                <p>
                    Node ID
                    <Tooltip content="Node ID of validator participating in the consensus protocol"></Tooltip>
                </p>
                <p style="text-align: right;">
                    <Tooltip content="Amount of AVAX staked by this validator"></Tooltip>Stake
                </p>
                <p style="text-align: right;" v-if="$vuetify.breakpoint.smAndUp">
                    <Tooltip
                        content="Percentage of AVAX concentrated up to this validator ranking"
                    ></Tooltip>Cumulative Stake
                </p>
            </div>
            <div v-if="validators.length === 0" class="empty_table">
                <p>No {{toggle}} Validators</p>
            </div>
            <div v-show="search.length === 0">
                <div v-show="validators.length > 0">
                    <validator-row
                        class="validator"
                        v-for="v in paginatedValidators"
                        :key="v.nodeID + v.stakeAmount"
                        :validator="v"
                        :cumulative-stake="cumulativeStake[v.rank - 1]"
                    ></validator-row>
                </div>
            </div>
            <div v-show="search.length > 0">
                <validator-row
                    class="validator"
                    v-for="v in matchedValidators"
                    :key="v.nodeID + v.stakeAmount"
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
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import ValidatorRow from "../components/rows/ValidatorRow/ValidatorRow.vue";
import ValidatorPaginationControls from "../components/misc/ValidatorPaginationControls.vue";
import { AVALANCHE_SUBNET_ID } from "@/store/modules/platform/platform";
import Tooltip from "../components/rows/Tooltip.vue";
import TooltipHeading from "../components/misc/TooltipHeading.vue";
import TooltipMeta from "../components/misc/TooltipMeta.vue";
import Metadata from "@/components/Validators/Metadata.vue";
import { IValidator } from "@/store/modules/platform/IValidator";

@Component({
    components: {
        Tooltip,
        ValidatorRow,
        ValidatorPaginationControls,
        Metadata
    },
    filters: {
        pluralize(val: number): string {
            return val === 0
                ? `${val} results`
                : val > 1
                ? `${val} results`
                : `${val} result`;
        }
    }
})
export default class Validators extends Vue {
    search: string =  "";
    toggle: string = "active"; // active | pending
    limit: number = 25; // how many rows to display
    start: number = 0;

    matchSearch(val: HTMLInputElement) {
        if (this.search) {
            let idUpper = val.id.toUpperCase();
            let queryUpper = this.search.toUpperCase();
            if (!idUpper.includes(queryUpper)) {
                return false;
            }
        }
        return true;
    }
    
    handleChange(val: number) {
        this.start = val; // all computed values will react to change
    }
    
    handleToggle(val: string) {
        this.toggle = val;
    }

    get totalStake() {
        let valBig =
            this.toggle === "active"
                ? this.$store.getters["Platform/totalStake"]
                : this.$store.getters["Platform/totalPendingStake"];
        return valBig.div(Math.pow(10, 9)).toLocaleString();
    }

    get totalValidatorsCount() {
        return this.toggle === "active"
            ? this.$store.getters["Platform/totalValidators"]
            : this.$store.getters["Platform/totalPendingValidators"];
    }

    get validators() {
        let defaultSubnet = this.$store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
        if (defaultSubnet) {
            return this.toggle === "active"
                ? defaultSubnet.validators
                : defaultSubnet.pendingValidators;
        }
        return [];
    }

    get matchedValidators() {
        return this.validators
            .filter((v: IValidator) => v.nodeID.includes(this.search))
            .slice(0, 10);
    }

    get paginatedValidators() {
        return this.validators.slice(this.start, this.start + this.limit);
    }
    
    get pendingValidators() {
        let defaultSubnet = this.$store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
        if (defaultSubnet) {
            let vals = defaultSubnet.pendingValidators;
            return vals;
        }
        return [];
    }
    
    get cumulativeStake() {
        let defaultSubnet = this.$store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
        if (defaultSubnet) {
            return this.toggle === "active"
                ? this.$store.getters["Platform/cumulativeStake"]
                : this.$store.getters["Platform/cumulativePendingStake"];
        }
        return [];
    }

}
</script>
<style scoped lang="scss">
@use "../main";

.pagination_container {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
}

.validators {
    background-color: main.$white;
    border-radius: 6px;
    padding: 30px;
}

.validator {
    border-top: 1px solid #e7e7e7;

    &:nth-of-type(2n) {
        background-color: main.$secondary-color-xlight;
    }
}

.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    color: main.$black;
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

@include main.device_s {
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

@include main.device_xs {
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
