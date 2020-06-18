<template>
    <div class="detail"> 
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Metadata :asset="asset"></Metadata>
        <template v-if="!tx">
            <Loader :contentId="assetID" :message="'Fetching Asset Details'"></Loader>
        </template>

        <section class="card meta asset_genesis">
            <header class="header">
                <h2>Asset Genesis Details</h2>
            </header>
            <article class="meta_row">
                <p class="label">Tx ID</p>
                <div class="genesis_tx" v-if="tx">
                    <p>
                        <b>{{txId}}</b>
                    </p>
                    <p v-if="isAssetGenesis" class="genesis">Asset Genesis</p>
                </div>
            </article>
            <article class="meta_row">
                <p class="label">Status</p>
                <div v-if="tx">
                    <p class="status">Success</p>
                    <p class="status" v-if="type==='assetCreation'">Success</p>
                </div>
            </article>
            <article class="meta_row">
                <p class="label">Timestamp</p>
                <p class="date" v-if="tx">
                    <fa :icon="['far','clock']"></fa>
                    {{dateAgo}} ({{date.toLocaleString()}})
                </p>
            </article>
            <article class="meta_row">
                <p class="label">Value</p>
                <p class="values" v-if="tx">
                    <span v-for="(val, id) in outValues" :key="id">{{val.amount}} {{val.symbol}}</span>
                </p>
            </article>
            <article class="meta_row">
                <p class="label">Transaction Fee</p>
                <p v-if="tx">0.00 AVA</p>
            </article>
            <article class="meta_row" v-if="!isAssetGenesis">
                <p class="label">Input UTXOs</p>
                <div v-if="tx && inputs.length > 0">
                    <div class="utxo_headers">
                        <p>Tx</p>
                        <p>Lock Time</p>
                        <p>Threshold</p>
                        <p>From</p>
                        <p class="amount">Amount</p>
                    </div>
                    <div v-if="tx">
                        <utxo-row
                            class="io_item"
                            v-for="(input, i) in inputs"
                            :key="i"
                            :utxo="input"
                            type="input"
                        ></utxo-row>
                    </div>
                </div>
                <div v-else>
                    <p>No input UTXOs found for this transaction on the explorer.</p>
                </div>
            </article>
            <article class="meta_row">
                <p class="label">Output UTXOs</p>
                <div v-if="tx && outputs.length > 0">
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
            </article>
        </section>
    </div>
</template>
<script>
import Loader from "../components/misc/Loader";
import Metadata from "../components/Asset/Metadata";
import UtxoRow from "../components/Transaction/UtxoRow";
import { Transaction } from "../js/Transaction";
import api from "../axios";
import Big from "big.js";
import moment from "moment";
import { bigToDenomString, stringToBig, blockchainMap } from "../helper";

export default {
    components: {
        Loader,
        Metadata,
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
    filters: {
        name(val) {
            return val.name ? val.name : val.id;
        }
    },
    computed: {
        breadcrumbs() {
            return [
                {
                    text: "Home",
                    disabled: false,
                    href: "/"
                },
                {
                    text: "Assets",
                    disabled: false,
                    href: "/assets"
                },
                {
                    text: `${
                        this.asset
                            ? this.asset.symbol
                                ? this.asset.symbol
                                : this.asset.id
                            : "Asset"
                    }`,
                    disabled: true,
                    href: ""
                }
            ];
        },
        assetID() {
            return this.$route.params.id;
        },
        asset() {
            return this.$store.state.assets[this.$route.params.id];
        },
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

<style scoped lang="scss">
@use "../main";

$symbol_w: 35px;

.symbol {
    margin-left: 20px;
    text-align: center;
    line-height: $symbol_w;
    background-color: #f1f2f3;
    color: #000;
    font-size: 14px;
    font-weight: bold;
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.asset_genesis {
    margin-top: 30px;
}
</style>