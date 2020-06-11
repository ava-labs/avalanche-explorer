<template>
    <div class="address_detail">
        <div class="meta" v-if="this.metaData">
            <h2>Address Details</h2>
            <div class="meta_row">
                <p class="label">Address</p>
                <p class="addr">
                    <b>X-{{address}}</b>
                    <span v-if="alias">{{alias}}</span>
                </p>
            </div>
        </div>
        <div class="meta" v-if="this.metaData">
            <h2>Asset Balances</h2>
            <div v-for="(asset, index) in metaData.assets" v-bind:key="index">
                <h3>
                    {{index}}
                </h3>
                <div class="meta_row">
                    <p class="label">Balance</p>
                    <p>{{asset.balance}}</p>
                </div>
                <div class="meta_row">
                    <p class="label">Total Received</p>
                    <p>{{asset.totalReceived}}</p>
                </div>
                <div class="meta_row">
                    <p class="label">Total Sent</p>
                    <p>{{asset.totalSent}}</p>
                </div>
                <div class="meta_row">
                    <p class="label">Transaction Count</p>
                    <p>{{asset.transactionCount}}</p>
                </div>
                <div class="meta_row">
                    <p class="label">UTXO Count</p>
                    <p>{{asset.utxoCount}}</p>
                </div>
            </div>
        </div>
        <div v-if="isAjax">
            <p>Loading</p>
        </div>
        <transition name="fade">
            <div v-if="!isAjax" class="transactions">
                <h2>Transactions</h2>
                <div class="table_headers tx_rows">
                    <p></p>
                    <p>ID</p>
                    <p>From</p>
                    <p>To</p>
                </div>
                <tx-table class="tx_table" :transactions="orderedTx"></tx-table>
            </div>
        </transition>
    </div>
</template>
<script>
import api from "../axios";
import TxTable from "../components/Address/TxTable";
import Big from "big.js";
import { stringToBig } from "../helper";
import AddressDict from "@/known_addresses";

export default {
    components: {
        TxTable
    },
    data() {
        return {
            transactions: [],
            isAjax: false,
            metaData: null
        };
    },
    watch: {
        address(val) {
            this.updateData();
        }
    },
    methods: {
        updateData() {
            let parent = this;
            let url = `/x/transactions?address=${this.address}`;
            this.isAjax = true;
            api.get(url).then(res => {
                parent.isAjax = false;
                const data = res.data.transactions;
                parent.transactions = data;
                console.log("/transactions?address=:", res);
            });

            url = `/x/addresses/${this.address}`;
            api.get(url).then(res => {
                parent.isAjax = false;
                const data = res.data;
                parent.metaData = data;
                console.log("/addresses/address:", data);
            });
        }
    },
    created() {
        this.updateData();
    },
    computed: {
        alias() {
            if (AddressDict[this.address]) {
                return AddressDict[this.address];
            }
            return "";
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
            if (!this.metaData) return Big(0);
            return stringToBig(this.metaData.balance, 9).toFixed(9);
            // return Big(this.metaData.balance);
        },
        txCount() {
            return this.metaData.transactionCount;
        },
        totalReceived() {
            return stringToBig(this.metaData.totalReceived, 9).toFixed(9);
            // return this.metaData.totalReceived;
        },
        totalSent() {
            let total = this.metaData.totalSent;
            console.log(total);
            return stringToBig(total, 9).toFixed(9);
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

.meta {
    overflow: auto;
    background-color: #fff;
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

.transactions {
    background-color: #fff;
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
    /*max-height: 500px;*/
}

.addr {
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;

    span {
        background-color: #e6ffe6;
        border: 1px solid #56c18d;
        color: #56c18d;
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
