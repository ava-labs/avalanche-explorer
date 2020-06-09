<template>
    <div class="transaction_details">
        <div class="meta" v-if="tx">
            <h2>Transaction Details</h2>
            <div class="meta_row">
                <p class="label">ID</p>
                <div class="meta_data">
                    <p><b>{{txId}}</b></p>
                    <p v-if="isAssetGenesis" class="genesis">Asset Genesis</p>
                </div>
            </div>
            <div class="meta_row">
                <p class="label">Status</p>
                <div>
                    <p class="status">Success</p>
                    <p class="status" v-if="type==='assetCreation'">Success</p>
                </div>
            </div>
            <div class="meta_row">
                <p class="label">Timestamp</p>
                <p class="date">
                    <fa :icon="['far','clock']"></fa>
                    {{dateAgo}} ({{date.toLocaleString()}})
                </p>
            </div>
            <div class="meta_row">
                <p class="label">Value</p>
                <p class="values">
                    <span v-for="(val, id) in outValues" :key="id">{{val.amount}} {{val.symbol}}</span>
                </p>
            </div>
            <div class="meta_row">
                <p class="label">Transaction Fee</p>
                <p>0.00 AVA</p>
            </div>

            <div class="meta_row" v-if="!isAssetGenesis">
                <p class="label">Input UTXOs</p>
                <div v-if="inputs.length > 0">
                    <div class="utxo_headers">
                        <p>Tx</p>
                        <p>Lock Time</p>
                        <p>Threshold</p>
                        <p>From</p>
                        <p class="amount">Amount</p>
                    </div>
                    <utxo-row
                        class="io_item"
                        v-for="(input, i) in inputs"
                        :key="i"
                        :utxo="input"
                        type="input"
                    ></utxo-row>
                </div>
                <div v-else>
                    <p>No input UTXOs found for this transaction on the explorer.</p>
                </div>
            </div>

            <div class="meta_row">
                <p class="label">Output UTXOs</p>
                <div v-if="outputs.length > 0">
                    <div class="utxo_headers">
                        <p>Tx</p>
                        <p>Lock Time</p>
                        <p>Threshold</p>
                        <p>To</p>
                        <p class="amount">Amount</p>
                    </div>
                    <utxo-row
                        class="io_item"
                        v-for="(output, i) in outputs"
                        :key="i"
                        :utxo="output"
                        type="output"
                    ></utxo-row>
                </div>
                <div v-else>
                    <p>No output utxos found for this transaction.</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from "../axios";
import UtxoRow from "../components/Transaction/UtxoRow";
import Big from "big.js";
import { Transaction } from "../js/Transaction";
import moment from "moment";
import { bigToDenomString, stringToBig } from "../helper";

export default {
    components: {
        UtxoRow
    },
    data() {
        return {
            tx_data: null,
            tx: null
        };
    },
    created() {
        this.getData();
    },
    watch: {
        txId(val) {
            this.getData();
        }
    },
    computed: {
        txId() {
            return this.$route.params.id;
        },
        networkId() {
            return "";
            // return this.tx_data.unsignedTx.networkID
        },
        chainId() {
            // return this.tx_data.unsignedTx.blockchainID
            return "";
        },
        inputs() {
            let res = [];

            let ins = this.tx.data.inputs;

            if (!ins) return res;

            for (let i = 0; i < ins.length; i++) {
                res.push(ins[i].output);
            }
            return res;
        },
        isAssetGenesis() {
            return this.type === "create_asset";
        },
        outputs() {
            return this.tx.data.outputs || [];
        },
        type() {
            return this.tx.data.type || "base";
        },
        date() {
            return new Date(this.tx.data.timestamp);
        },
        dateAgo() {
            return moment(this.date).fromNow();
        },
        assets() {
            return this.$store.state.assets;
        },
        outValues() {
            let dict = {};

            let outs = this.outputs;

            outs.forEach(out => {
                let assetId = out.assetID;
                let amount = out.amount;
                let asset = this.assets[assetId];

                if (dict[assetId]) {
                    let valNow = dict[assetId].amount;
                    dict[assetId].amount = valNow.plus(
                        stringToBig(amount, asset.denomination)
                    );
                } else {
                    dict[assetId] = {
                        symbol: asset.symbol,
                        amount: stringToBig(amount, asset.denomination)
                    };
                }
            });

            return dict;
        }
    },
    methods: {
        getData() {
            let parent = this;
            let url = `/x/transactions/${this.txId}`;
            api.get(url)
                .then(res => {
                    const data = res.data;
                    parent.tx_data = data;
                    let tx = new Transaction(data);
                    parent.tx = tx;
                    console.log(tx);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>
<style lang="scss">
.transaction_details {
    a {
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        color: #71c5ff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
<style scoped lang="scss">
@use '../main';
h2 {
    margin: 0;
    font-size: 18px;
    padding: 15px 30px;
}

.transaction_details {
    font-size: 13px;

    > div {
        position: relative;
    }
}

.genesis {
    background-color: #e6ffe6;
    border: 1px solid #56c18d;
    color: #56c18d;
    width: max-content;
    padding: 4px 8px;
    margin: 0px 30px;
    word-break: keep-all;
}

.meta {
    background-color: #fff;
    padding: 30px;
    overflow: auto;
    border-radius: 6px;
    word-break: break-all;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.meta_row {
    display: grid;
    grid-template-columns: 140px 1fr;
    padding: 15px 30px;
    border-bottom: 1px solid #f2f2f2;
    .label {
        font-weight: normal;
        margin-right: 8px;
    }

    &:last-of-type {
        border: none;
    }
}

.meta_data {
    display: flex;
    align-items: center;
}

.id {
    overflow: hidden;
    text-overflow: ellipsis;
}

.main_info {
    display: flex;
}

.main_info > div {
    margin-right: 14px;
}

.utxo_headers {
    display: grid;
    grid-gap: 10px;

    p {
        font-weight: bold;
    }
}

.io {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: 30px;
    padding: 15px 30px;
    overflow: auto;
}

.utxo_headers,
.io_item {
    grid-template-columns: 80px 80px 80px 100px 1fr;
}

.io_item {
    font-size: 13px;
    padding: 10px 0px;
    overflow: auto;
    border-bottom: 1px solid #f2f2f2;

    &:last-of-type {
        border: none;
    }
}

.status {
    background-color: #e4fbef;
    color: #56c18d;
    width: max-content;
    border-radius: 3px;
    padding: 4px 8px;
}

.amount {
    text-align: right;
}

.no_input {
    background-color: #ffe6e6;
    border: 1px solid #c15656;
    color: #c15656;
}

.outputs {
    overflow: auto;
}

.values {
    span {
        background-color: #e6f5ff;
        color: #71c5ff;
        margin-right: 4px;
        padding: 4px 8px;
        border-radius: 3px;
    }
}

@include main.sm-device {
    .transaction_details {
        padding: main.$container_padding_mobile;
    }

    .meta {
        padding: 10px;
    }

    .meta_row {
        padding: 10px;
        grid-template-columns: none;
        grid-template-rows: max-content 1fr;
    }

    .io {
        grid-template-columns: none;
        grid-template-rows: max-content max-content;
    }
    
    .label {
        font-weight: bold !important;
        margin-bottom: 8px;
    }
}
</style>
