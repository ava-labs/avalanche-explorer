<template>
    <div class="blockchain">
        <div class="card meta_data">
            <div class="header">
                <h2>
                    Validators
                    <TooltipHeading
                        content="A validator is a node participating in the consensus protocol. Validators work together to achieve consensus as to which transactions have taken place on a blockchain."
                    ></TooltipHeading>
                </h2>
                <v-tabs
                    class="tabs"
                    @change="typeChange"
                    active-class="tab_active"
                    height="32"
                    hide-slider
                >
                    <v-tab>Active</v-tab>
                    <v-tab>Pending</v-tab>
                </v-tabs>
            </div>
            <div class="stats">
                <article>
                    <img src="@/assets/ava_price-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Total {{toggle}} Stake
                            <TooltipMeta
                                content="total value of scarce resource ($AVA) used to secure the AVA network using the Proof-of-Stake method"
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalStake}} <span class="unit">AVA</span></p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/validators-purple.png" />
                    <div class="stat">
                        <p class="label">
                            {{toggle}} Validators
                            <TooltipMeta
                                content="total number of nodes participating in the consensus protocol"
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalValidatorsCount.toLocaleString()}}</p>
                    </div>
                </article>
            </div>
        </div>
        <div class="validators card">
            <div class="header">
                <h2>Staking Distribution</h2>
            </div>
            <div class="controls">
                <div class="search_container">
                    <div class="search_count">
                        <p
                            v-show="search.length === 0"
                        >{{totalValidatorsCount.toLocaleString()}} {{toggle}} validators</p>
                        <p
                            v-show="search.length > 0 && matchedValidators"
                        >{{matchedValidators.length.toLocaleString()}} results found</p>
                    </div>
                    <div class="search_tabs">
                        <input
                            class="search"
                            type="text"
                            v-model="search"
                            placeholder="Filter by Validator ID"
                        />
                    </div>
                </div>
            </div>
            <div class="headers">
                <p>Rank</p>
                <p>
                    Validator ID
                    <Tooltip content="address of the node participating in the consensus protocol"></Tooltip>
                </p>
                <p style="text-align: right;">
                    <Tooltip content="amount of $AVA staked by this node"></Tooltip>Stake
                </p>
                <p style="text-align: right;" v-if="$vuetify.breakpoint.smAndUp">
                    <Tooltip
                        content="percentage of scarce resource ($AVA) concentrated up to this validator ranking"
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
                        :key="v.id + v.stakeAmount"
                        :validator="v"
                        :cumulative-stake="cumulativeStake[v.rank - 1]"
                    ></validator-row>
                </div>
            </div>
            <div v-show="search.length > 0">
                <validator-row
                    class="validator"
                    v-for="v in matchedValidators"
                    :key="v.id + v.stakeAmount"
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
<script>
import ValidatorRow from "../components/rows/ValidatorRow/ValidatorRow";
import ValidatorPaginationControls from "../components/misc/ValidatorPaginationControls";
import { AVA_SUBNET_ID } from "@/store/modules/platform/platform";
import Tooltip from "../components/rows/Tooltip";
import TooltipHeading from "../components/misc/TooltipHeading";
import TooltipMeta from "../components/misc/TooltipMeta";

export default {
    data() {
        return {
            search: "",
            toggle: "active", // active | pending
            limit: 25, // how many rows  to display
            start: 0
        };
    },
    components: {
        Tooltip,
        TooltipHeading,
        TooltipMeta,
        ValidatorRow,
        ValidatorPaginationControls
    },
    methods: {
        typeChange(val) {
            this.toggle = val ? "pending" : "active";
        },
        matchSearch(val) {
            if (this.search) {
                let idUpper = val.id.toUpperCase();
                let queryUpper = this.search.toUpperCase();
                if (!idUpper.includes(queryUpper)) {
                    return false;
                }
            }
            return true;
        },
        handleChange(val) {
            this.start = val; // all computed values will react to change
        }
    },
    computed: {
        totalStake() {
            let valBig =
                this.toggle === "active"
                    ? this.$store.getters["Platform/totalStake"]
                    : this.$store.getters["Platform/totalPendingStake"];
            return valBig.div(Math.pow(10, 9)).toLocaleString();
        },
        totalValidatorsCount() {
            return this.toggle === "active"
                ? this.$store.getters["Platform/totalValidators"]
                : this.$store.getters["Platform/totalPendingValidators"];
        },
        validators() {
            let defaultSubnet = this.$store.state.Platform.subnets[
                AVA_SUBNET_ID
            ];
            if (defaultSubnet) {
                return this.toggle === "active"
                    ? defaultSubnet.validators
                    : defaultSubnet.pendingValidators;
            }
            return [];
        },
        matchedValidators() {
            return this.validators
                .filter(v => v.id.includes(this.search))
                .slice(0, 10);
        },
        paginatedValidators() {
            return this.validators.slice(this.start, this.start + this.limit);
        },
        pendingValidators() {
            let defaultSubnet = this.$store.state.Platform.subnets[
                AVA_SUBNET_ID
            ];
            if (defaultSubnet) {
                let vals = defaultSubnet.pendingValidators;
                return vals;
            }
            return [];
        },
        cumulativeStake() {
            let defaultSubnet = this.$store.state.Platform.subnets[
                AVA_SUBNET_ID
            ];
            if (defaultSubnet) {
                return this.toggle === "active"
                    ? this.$store.getters["Platform/cumulativeStake"]
                    : this.$store.getters["Platform/cumulativePendingStake"];
            }
            return [];
        }
    }
};
</script>
<style scoped lang="scss">
@use "../main";

.meta_data {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.controls {
    margin-bottom: 12px;

    .search_container {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;

        .search_count {
            text-transform: capitalize;
            font-weight: 400;
        }

        .search_tabs {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 18px;
        }

        .search {
            border: 2px solid main.$gray-light;
            height: 36px;
            width: 320px;
            box-sizing: border-box;
            border-radius: 4px;
            padding: 8px 12px;
            outline: none;
            font-size: 14px;
        }
    }
}

.stats {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr max-content;

    > article {
        padding: 30px 15px 0;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 20px;
    }

    .stat {
        display: flex;
        flex-direction: column;

        p {
            font-weight: 400; /* 700 */
        }

        .label {
            text-transform: capitalize;
            color: main.$primary-color;
            margin-bottom: 6px;
            font-size: 14px;
        }

        .meta_val {
            font-size: 32px;
            line-height: 1em;

            .unit {
                font-size: 14px;
                opacity: 0.7;
            }
        }
    }
}

@include main.device_m {
    .stats {
        
    }
}

@include main.device_s {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        > div {
            padding: 30px 0 0;
        }

        img {
            width: 24px;
        }

        .stat {
            .label {
                font-size: 13px;
            }

            .meta_val {
                font-size: 20px;

                .unit {
                    font-size: 14px;
                }
            }
        }
    }
}

@include main.device_xs {
    .meta_data {
        margin-bottom: 10px;
    }

    .stats {
        grid-template-columns: none;

        > article {
            padding: 15px 0 0;
        }

        img {
            display: none;
        }
    }
}

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
        background-color: main.$primary-color-xlight;
    }
}

.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    font-size: 16px;
    font-weight: 400; /* 700 */

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

.tabs {
    flex-direction: row-reverse;
    display: inline-block;
    width: max-content;
    flex-grow: 0;
}

.v-tab {
    color: #000 !important;
    border: 2px solid #000;
    background-color: transparent;
    font-size: 13px;
    font-weight: 400; /* 700 */
    letter-spacing: 0;
    margin: 0;
    text-transform: none;

    &:first-child {
        border-radius: 4px 0 0 4px;
    }

    &:last-child {
        border-radius: 0 4px 4px 0;
    }
}

.tab_active {
    background-color: #000;
    color: main.$white !important;
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

    .tabs {
        margin-top: 20px;
        width: 100%;
    }

    .v-tab {
        flex-grow: 1;
    }

    .meta_data {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        > div {
            text-align: left;
            padding: 0;
        }
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
        grid-template-columns: 42px 1fr 1fr .5fr;
        font-size: 11px;
        font-weight: 400; /* 700 */

        p {
            padding: 12px 15px 12px 0;
        }

        &:first-child {
            text-align: left;
        }
    }
}
</style>
