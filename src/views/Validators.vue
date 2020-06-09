<template>
    <div class="blockchain">
        <div class="card meta_data_container">
            <div class="header">
                <v-tooltip bottom left>
                    <template v-slot:activator="{ on }">
                        <h2 v-on="on">Validators</h2>
                    </template>
                    <span>
                        A validator is a node participating in the consensus protocol.
                        <br />Validators work together to achieve consensus as to which transactions have taken place on a blockchain.
                    </span>
                </v-tooltip>
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
            <div class="meta_data">
                <div>
                    <img src="@/assets/ava_price.png" />
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <p class="label" v-on="on">Total {{toggle}} Stake</p>
                            </template>
                            <span>Total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method.</span>
                        </v-tooltip>
                        <p class="meta_val">{{totalStake}} AVA</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/validators.png" />
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <p class="label" v-on="on">{{toggle}} Validators</p>
                            </template>
                            <span>Total number of nodes participating in the consensus protocol of the AVA network.</span>
                        </v-tooltip>
                        <p class="meta_val">{{totalValidatorsCount}}</p>
                    </div>
                </div>
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
                        >{{totalValidatorsCount}} {{toggle}} validators</p>
                        <p
                            v-show="search.length > 0 && matchedValidators"
                        >{{matchedValidators.length}} results found</p>
                    </div>
                    <div class="search_tabs">
                        <input
                            class="search"
                            type="text"
                            v-model="search"
                            placeholder="Search by Validator ID"
                        />
                    </div>
                </div>
            </div>
            <div class="headers">
                <p style="text-align: center;">Rank</p>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p v-on="on">Validator ID</p>
                    </template>
                    <span>Address of the node participating in the consensus protocol.</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p v-on="on" style="text-align: right;">Stake</p>
                    </template>
                    <span>The amount of $AVA staked by this node.</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p v-on="on" style="text-align: right;">Cumulative Stake</p>
                    </template>
                    <span>
                        The percentage of scarce resource ($AVA) concentrated up to this validator ranking.
                        <br />The distribution is proportional to the influence a single node can have on the decentraled network.
                    </span>
                </v-tooltip>
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
            return valBig.div(Math.pow(10, 9));
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
@use '../main';

.meta_data_container {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr max-content;

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 15px;
    }
    > div {
        padding: 30px;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    p {
        font-size: 32px;
        font-weight: bold;
    }

    .label {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 6px;
        opacity: 0.7;
    }

    .meta_val {
        line-height: 1em;
    }
}

.controls {
    margin-bottom: 12px;

    .search_container {
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .search_count {
            text-transform: capitalize;
        }

        .search_tabs {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 18px;
        }

        .search {
            border: 1px solid #d6dae1;
            height: 36px;
            width: 320px;
            box-sizing: border-box;
            border-radius: 4px;
            padding: 8px 12px;
            outline: none;
            font-size: 12px;
        }
    }
}

.pagination_container {
    display: flex;
    justify-content: flex-end;
}

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
    border: 1px solid #000;
    background-color: transparent;
    font-size: 13px;
    margin: 0px 5px;
    border-radius: 4px;
    text-transform: none;
}

.tab_active {
    background-color: #000;
    color: #fff !important;
}

@include main.sm-device {
    .header {
        flex-direction: column;
    }

    .controls {
        margin-bottom: 12px;

        .search_container {
            display: flex;
            flex-direction: column;
            /* justify-content: space-between; */
            /* align-items: baseline; */

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
        margin-top: 30px;
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
            padding: 30px 0 0;
        }
    }
}
</style>
