<template>
    <section class="card meta" v-if="tx">
        <header class="header">
            <h2><slot></slot></h2>
        </header>
        <article class="meta_row">
            <p class="label">ID</p>
            <div class="genesis_tx">
                <p>
                    <b>{{txId}}</b>
                </p>
                <p v-if="isAssetGenesis" class="genesis">Asset Genesis</p>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">Status</p>
            <div>
                <p class="status">Success</p>
                <p class="status" v-if="type==='assetCreation'">Success</p>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">Timestamp</p>
            <p class="date">
                <fa :icon="['far','clock']"></fa>
                {{dateAgo}} ({{date.toLocaleString()}})
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Value</p>
            <p class="values">
                <span
                    v-for="(val, id) in outValuesDenominated"
                    :key="id"
                >{{val.amount}} {{val.symbol}}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Transaction Fee</p>
            <!-- TODO: Tx Fee from API when supported -->
            <p>0.001 AVAX</p>
        </article>
        <article class="meta_row" v-if="!isAssetGenesis">
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
                <p>No input UTXOs found for this transaction on the Avalanche Explorer.</p>
            </div>
        </article>
        <article class="meta_row">
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
        </article>
    </section>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import UtxoRow from "../components/Transaction/UtxoRow.vue";
import { Transaction } from "../js/Transaction";
import {
    ITransactionOutput,
    OutputValuesDict,
    outValuesDenominated
} from "../js/ITransaction";
import { bigToDenomString, stringToBig } from "../helper";
import Big from "big.js";
import moment from "moment";

@Component({
    components: {
        UtxoRow
    }
})
export default class TransactionDetailCard extends Vue {
    @Prop() tx!: Transaction;

    get txId(): string {
        return this.tx.id;
    }

    get chainId(): string {
        return this.tx.chainID;
    }

    get inputs(): ITransactionOutput[] {
        let res: ITransactionOutput[] = [];
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
        return this.tx.outputs;
    }

    get type(): string {
        return this.tx.type;
    }

    get date(): Date {
        return new Date(this.tx.timestamp);
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

    get outValuesDenominated() {
        let outValuesDenominated: outValuesDenominated = {};
        for (let assetId in this.outValues) {
            let val = this.outValues[assetId];
            let res = stringToBig(val.amount.toString(), val.denomination).toLocaleString(val.denomination);
            outValuesDenominated[assetId] = {
                amount: res,
                symbol: val.symbol
            };
        }
        return outValuesDenominated;
    }
}
</script>

<style scoped lang="scss">
@use "../main";
</style>