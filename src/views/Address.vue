<template>
    <div class="address_detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="isAjax">
            <Loader :contentId="txId" :message="'Fetching Address Details'"></Loader>
        </template>
        <div class="meta" v-if="this.metaData">
            <h2>X-{{address}}</h2>
            <div class="meta_row">
                <p class="label">Address</p>
                <p class="addr">
                    <span>X-{{address}}</span>
                    <span class="alias" v-if="alias">{{alias}}</span>
                </p>
            </div>
            <div class="meta_row">
                <p class="label">AVA Balance</p>
                <p>{{avaBalance}} nAVA</p>
            </div>
            <div class="meta_row">
                <p class="label">Transactions</p>
                <p>{{totalTransactionCount.toLocaleString()}}</p>
            </div>
            <div class="meta_row">
                <p class="label">Portfolio</p>
                <div class=balances_container>
                    <div class="bar">
                        <p class="count">{{Object.keys(assets).length}} assets found</p>
                    </div>
                    <div class="grid_headers balance_row">
                        <p>
                            Symbol <Tooltip content="shorthand ticker symbol of the asset"></Tooltip>
                        </p>
                        <p>
                            Name <Tooltip content="human-readable name for the asset"></Tooltip>
                        </p>
                        <p class="balance">
                            <Tooltip content="balance held by this address"></Tooltip>Balance
                        </p>
                        <p class="received">
                            <Tooltip content="total received by this address"></Tooltip>Received
                        </p>
                        <p class="sent">
                            <Tooltip content="total sent by this address"></Tooltip>Sent
                        </p>
                        <p class="txs">
                            <Tooltip content="total transactions involving this address"></Tooltip>Txs
                        </p>
                        <p class="utxos">
                            <Tooltip content="total UTXOs involving this address"></Tooltip>UTXOs
                        </p>
                    </div>
                    <BalanceRow
                        v-for="(asset, index) in metaData.assets"
                        v-bind:key="index"
                        :asset="asset"
                    ></BalanceRow>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div v-if="!isAjax" class="transactions">
                <h2>Transactions</h2>
                <div class="table_headers tx_rows">
                    <p></p>
                    <p>
                        ID
                        <Tooltip
                            content="a transaction queries or modifies the state of a blockchain"
                        ></Tooltip>
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
                <tx-table class="tx_table" :transactions="orderedTx"></tx-table>
            </div>
        </transition>
    </div>
</template>
<script>
import api from "../axios";
import Loader from "../components/misc/Loader";
import Tooltip from "../components/rows/Tooltip";
import BalanceRow from "../components/Address/BalanceRow";
import TxTable from "../components/Address/TxTable";
import Big from "big.js";
import { stringToBig } from "../helper";
import AddressDict from "@/known_addresses";
import { blockchainMap } from "@/helper";

export default {
    components: {
        Loader,
        Tooltip,
        BalanceRow,
        TxTable
    },
    data() {
        return {
            isAjax: false,
            metaData: null,
            transactions: [],
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
    watch: {
        address(val) {
            this.updateData();
        }
    },
    created() {
        this.updateData();
    },
    filters: {
        blockchain(val) {
            return blockchainMap(val);
        },
        nameOrID(val) {
            return val.name ? val.name : val.id;
        }
    },
    computed: {
        alias() {
            return AddressDict[this.address] ? AddressDict[this.address] : "";
        },
        assets() {
            return this.metaData.assets;
        },
        assetsMap() {
            return this.$store.state.assets;
        },
        orderedTx() {
            let txs = this.transactions;
            txs.sort((a, b) => {
                let timeA = new Date(a.timestamp);
                let timeB = new Date(b.timestamp);

                if (timeA.getTime() > timeB.getTime()) {
                    return -1;
                } else {
                    return 1;
                }
            });
            return txs;
        },
        address() {
            return this.$route.params.address;
        },
        balance() {
            return !this.metaData
                ? Big(0)
                : stringToBig(this.metaData.balance, 9).toFixed(9);
        },
        txCount() {
            return this.metaData.transactionCount;
        },
        totalReceived() {
            return stringToBig(this.metaData.totalReceived, 9).toFixed(9);
        },
        totalSent() {
            return stringToBig(this.metaData.totalSent, 9).toFixed(9);
        },
        avaBalance() {
            return this.metaData.assets[
                "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"
            ].balance;
        },
        totalTransactionCount() {
            return this.metaData.totalTransactionCount;
        },
        totalUtxoCount() {
            return this.metaData.totalUtxoCount;
        }
    },
    methods: {
        updateData() {
            let parent = this;
            this.isAjax = true;

            // Get txs by address
            let url = `/x/transactions?address=${this.address}`;
            api.get(url).then(res => {
                console.log("/transactions?address=:", res);
                parent.isAjax = false;
                parent.transactions = res.data.transactions;
            });

            // Get address details
            url = `/x/addresses/${this.address}`;
            api.get(url).then(res => {
                console.log("/addresses/address:", res.data);
                parent.isAjax = false;
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
                    assets[asset].balance = parseInt(assets[asset].balance);
                    assets[asset].totalReceived = parseInt(assets[asset].totalReceived);
                    assets[asset].totalSent = parseInt(assets[asset].totalSent);
                    assets[asset].proportionOfCurrentSupply = ((parseInt(assets[asset].balance) / parseInt(assets[asset].currentSupply)) *100).toFixed(2);
                    totalTransactionCount += assets[asset].transactionCount;
                    totalUtxoCount += assets[asset].utxoCount;
                }
                parent.metaData.totalTransactionCount = totalTransactionCount;
                parent.metaData.totalUtxoCount = totalUtxoCount;
            });
        }
    }
};
</script>
<style lang="scss">
.address_detail {
    h4 {
        padding: 15px 30px;
        font-size: 12px;
        margin: 0;
    }
}
</style>
<style scoped lang="scss">
@use '../main';

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

h2 {
    padding: 15px 0px;
    margin: 0;
    font-size: 18px;
}

h3 {
    font-size: 12px;
}

.meta {
    overflow: auto;
    background-color: main.$white;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    margin-bottom: 15px;
    padding: 15px 30px;
}

.meta_row {
    font-size: 12px;
    display: grid;
    grid-template-columns: 140px 1fr;

    padding: 15px 0;
    border-bottom: 1px solid #f2f2f2;
    .label {
        font-weight: normal;
        margin-right: 8px;
    }

    &:last-of-type {
        border: none;
    }
}

.count {
    margin-bottom: 12px;
}

.grid_headers {
    font-weight: 700;
    font-size: 12px;
}

.balances_container {
    overflow-x: scroll;
}

.balance,
.sent,
.received,
.txs,
.utxos {
    text-align: right;
}

.balance_row {
    display: grid;
    grid-template-columns: 60px 1fr 100px 100px 100px 100px 100px;
    padding: 10px 0;
    border-bottom: 1px solid #e7e7e7;
    column-gap: 10px;

    &:last-of-type {
        border: none;
    }
}


.transactions {
    background-color: main.$white;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: auto;
    padding: 15px 30px;
}

.table_headers {
    display: grid;
    grid-template-columns: 35px 120px 1fr 1fr;
    padding-bottom: 7px;
    border-bottom: 1px solid #e7e7e7;

    p {
        padding: 0px 10px;
        font-weight: bold;
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

@include main.device_s {
    .meta {
        padding: 15px;
    }

    .meta_row {
        padding: 8px;
    }

    .transactions {
        padding: 8px;
    }

    .table_headers {
        display: none;
    }
}
</style>
