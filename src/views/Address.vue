<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="loading">
            <Loader :contentId="address" :message="'Fetching Address Details'"></Loader>
        </template>
        <section class="card meta" v-if="this.metaData">
            <header class="header">
                <h2>X-{{address}}</h2>
            </header>
            <article class="meta_row">
                <p class="label">Address</p>
                <p class="addr">
                    <span>X-{{address}}</span>
                    <span class="alias" v-if="alias">{{alias}}</span>
                </p>
            </article>
            <article class="meta_row">
                <p class="label">AVAX Balance</p>
                <p>{{avaxBalance}} AVAX</p>
            </article>
            <article class="meta_row">
                <p class="label">Transactions</p>
                <p>{{totalTransactionCount.toLocaleString()}}</p>
            </article>
            <article class="meta_row">
                <p class="label">Portfolio</p>
                <BalanceTable :assets="assets"></BalanceTable>
            </article>
        </section>

        <section v-if="!loading" class="card transactions">
            <header class="header">
                <h2>Transactions</h2>
                <template v-if="txloading && !assetsLoaded">
                    <v-progress-circular :size="16" :width="2" color="#976cfa" indeterminate key="1"></v-progress-circular>
                </template>
                <template v-else>
                    <div class="bar">
                        <p class="count">{{totalTransactionCount.toLocaleString()}} transactions found</p>
                        <div class="pagination-container">
                            <pagination-controls
                                :total="totalTransactionCount"
                                :limit="limit"
                                @change="page_change"
                                ref="paginationTop"
                            ></pagination-controls>
                        </div>
                    </div>
                </template>
            </header>
            <div class="table_headers tx_rows">
                <p></p>
                <p>
                    ID
                    <Tooltip content="a transaction queries or modifies the state of a blockchain"></Tooltip>
                </p>
                <p>
                    From
                    <Tooltip content="address that sends transfer value"></Tooltip>
                </p>
                <p>
                    To
                    <Tooltip content="address that receives transfer value"></Tooltip>
                </p>
            </div>
            <div v-show="txloading">
                <v-progress-circular :size="16" :width="2" color="#976cfa" indeterminate key="1"></v-progress-circular>
            </div>
            <div v-show="!txloading">
                <div class="rows">
                    <transition-group name="fade">
                    <tx-row
                        class="tx_item"
                        v-for="tx in transactions"
                        :transaction="tx"
                        :key="tx.id"
                    ></tx-row>
                    </transition-group>
                </div>
                <div class="bar-table">
                    <pagination-controls 
                        :total="totalTransactionCount" 
                        :limit="limit" 
                        @change="page_change" 
                        ref="paginationBottom">
                    </pagination-controls>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import Loader from "../components/misc/Loader";
import Tooltip from "../components/rows/Tooltip";
import BalanceTable from "../components/Address/BalanceTable";
import BalanceRow from "../components/Address/BalanceRow";
import TxRow from "../components/rows/TxRow/TxRow.vue";
import PaginationControls from "../components/misc/PaginationControls";
import api from "../axios";
import Big from "big.js";
import { stringToBig, blockchainMap } from "@/helper";
import AddressDict from "@/known_addresses";

export default {
    components: {
        Loader,
        Tooltip,
        BalanceTable,
        TxRow,
        PaginationControls
    },
    data() {
        return {
            loading: false,
            txloading: false,
            metaData: null,
            transactions: [],
            totalTx: 0,
            limit: 25, // how many to display
            offset: 0,
            sort: "timestamp-desc",
            breadcrumbs: [
                {
                    text: "Home",
                    disabled: false,
                    href: "/"
                },
                {
                    text: "Address",
                    disabled: true,
                    href: ""
                }
            ]
        };
    },
    filters: {
        pluralize(val) {
            return val === 0
                ? `${val} assets`
                : val > 1
                ? `${val} assets`
                : `${val} asset`;
        },
    },
    watch: {
        address(val) {
            this.updateData();
        },
        assetsLoaded() {
            this.updateData();
        }
    },
    created() {
        this.updateData();
    },
    computed: {
        assetsLoaded() {
            return this.$store.state.assetsLoaded;
        },
        alias() {
            return AddressDict[this.address] ? AddressDict[this.address] : "";
        },
        assets() {
            return this.metaData.assets;
        },
        assetsMap() {
            return this.$store.state.assets;
        },
        address() {
            return this.$route.params.address;
        },
        txCount() {
            return this.metaData.transactionCount;
        },
        avaxBalance() {
            return this.metaData.assets[
                "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"
            ].balance;
        },
        totalTransactionCount() {
            return !this.metaData ? 0 : this.metaData.totalTransactionCount;
        },
        totalUtxoCount() {
            return !this.metaData ? 0 : this.metaData.totalUtxoCount;
        }
    },
    methods: {
        updateData() {
            let parent = this;
            this.loading = true;
            this.txloading = true;

            if (this.assetsLoaded) {
                // Get txs by address
                let url = `/x/transactions?address=${this.address}&sort=${this.sort}&offset=${this.offset}&limit=${this.limit}`;

                api.get(url).then(res => {
                    parent.txloading = false;
                    parent.transactions = res.data.transactions;
                });

                // Get address details
                url = `/x/addresses/${this.address}`;
                api.get(url).then(res => {
                    parent.loading = false;
                    parent.metaData = res.data;
                    // Enrich assets data
                    let assets = parent.metaData.assets;
                    let totalTransactionCount = 0;
                    let totalUtxoCount = 0;
                    for (const asset in assets) {
                        assets[asset].name = this.assetsMap[asset].name;
                        assets[asset].denomination = this.assetsMap[asset].denomination;
                        assets[asset].symbol = this.assetsMap[asset].symbol;
                        assets[asset].currentSupply = this.assetsMap[asset].currentSupply;
                        assets[asset].balance = stringToBig(assets[asset].balance, assets[asset].denomination);
                        assets[asset].totalReceived = stringToBig(assets[asset].totalReceived, assets[asset].denomination);
                        assets[asset].totalSent = stringToBig(assets[asset].totalSent, assets[asset].denomination);
                        assets[asset].proportionOfCurrentSupply = ((parseInt(assets[asset].balance) / parseInt(assets[asset].currentSupply)) * 100).toFixed(2);
                        totalTransactionCount += assets[asset].transactionCount;
                        totalUtxoCount += assets[asset].utxoCount;
                    }
                    parent.metaData.totalTransactionCount = totalTransactionCount;
                    parent.metaData.totalUtxoCount = totalUtxoCount;
                });
            }
        },

        getTx() {
            let parent = this;
            parent.txloading = true;

            // Get txs by address
            let url = `/x/transactions?address=${this.address}&sort=${this.sort}&offset=${this.offset}&limit=${this.limit}`;

            api.get(url).then(res => {
                parent.txloading = false;
                parent.transactions = res.data.transactions;
            });
        },

        page_change(val) {
            this.offset = val;
            this.getTx();
            let pgNum = Math.floor(this.offset / this.limit) + 1;
            // @ts-ignore
            this.$refs.paginationTop.setPage(pgNum); 
            // @ts-ignore
            this.$refs.paginationBottom.setPage(pgNum);
        }
    }
};
</script>

<style scoped lang="scss">
@use "../main";

/* ==========================================
   details
   ========================================== */

.addr {
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;

    .alias {
        background-color: #e6ffe6;
        border: 1px solid main.$green;
        color: main.$green;
        width: max-content;
        padding: 4px 8px;
        margin: 0px 30px;
    }
}

/* ==========================================
   transactions
   ========================================== */

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.transactions {
    overflow: auto;
    margin-top: 30px;

    .table_headers {
        display: grid;
        grid-template-columns: 35px 120px 1fr 1fr;
        padding-bottom: 7px;
        border-bottom: 1px solid #e7e7e7;

        p {
            padding: 0px 10px;
            font-weight: 400; /* 700 */
            font-size: 12px;
        }
    }

    .tx_rows {
        width: 100%;
        border-radius: 2px;
        margin: 2px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
    }

    .tx_table {
        font-size: 12px;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

@include main.device_s {
    .bar {
        flex-direction: column;
        align-items: stretch;

        .pagination-container {
            padding-top: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

    }

    .bar-table {
        justify-content: center;
    }

    .transactions {
        .table_headers {
            display: none;
        }
    }
}
</style>
