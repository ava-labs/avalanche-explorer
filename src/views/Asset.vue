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
                    <span v-for="(val, id) in outValues" :key="id">{{val.amount.toLocaleString(val.denomination)}} {{val.symbol}}</span>
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

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";

import Loader from "../components/misc/Loader.vue";
import Metadata from "../components/Asset/Metadata.vue";
import UtxoRow from "../components/Transaction/UtxoRow.vue";

import { Transaction } from "../js/Transaction";
import api from "../axios";
import Big from "big.js";
import moment from "moment";
import { bigToDenomString, stringToBig, blockchainMap } from "../helper";
import { Asset } from "@/js/Asset";
import { OutputValuesDict, ITransactionOutput } from "@/js/ITransaction";

@Component({
    components: {
        Loader,
        Metadata,
        UtxoRow
    }
})
export default class AssetPage extends Vue {
    tx: Transaction | null = null;

    created() {
        this.getData();
    }

    get breadcrumbs(): any[] {
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
    }

    get assetID(): string {
        return this.$route.params.id;
    }

    get asset(): Asset {
        return this.$store.state.assets[this.$route.params.id];
    }

    get txId(): string {
        return this.$route.params.id;
    }

    get chainId(): string {
        return !this.tx ? "" : this.tx.chainID;
    }

    get inputs(): ITransactionOutput[] {
        let res: ITransactionOutput[] = [];

        if (!this.tx) return res;

        let ins = this.tx.inputs;

        if (!ins) return res;

        for (let i = 0; i < ins.length; i++) {
            res.push(ins[i].output);
        }
        return res;
    }

    get isAssetGenesis(): boolean {
        return this.type === "create_asset";
    }

    get outputs(): ITransactionOutput[] {
        return !this.tx ? [] : this.tx.outputs;
    }

    get type(): string {
        return !this.tx ? "base" : this.tx.type;
    }

    get date(): Date {
        return !this.tx ? new Date() : new Date(this.tx.timestamp);
    }

    get dateAgo(): string {
        return moment(this.date).fromNow();
    }

    get assets(): any {
        return this.$store.state.assets;
    }

    get outValues(): OutputValuesDict {
        let dict: OutputValuesDict = {};
        let outs = this.outputs;

        outs.forEach(out => {
            let assetId = out.assetID;
            let amount = out.amount;
            let asset = this.assets[assetId];
            let denomination = asset.denomination;

            if (dict[assetId]) {
                let valNow = dict[assetId].amount;
                dict[assetId].amount = valNow.plus(amount);
            } else {
                dict[assetId] = {
                    symbol: asset.symbol,
                    amount,
                    denomination
                };
            }
        });

        return dict;
    }

    getData():void  {
        let parent = this;
        let url = `/x/transactions/${this.txId}`;
        api.get(url)
            .then(res => {
                const data = res.data;
                console.log(data);
                let tx = new Transaction(data);
                parent.tx = tx;
                console.log(tx);
            })
            .catch(err => {
                console.log(err);
            });
    }
}
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