<template>
    <section class="card meta" v-if="tx">
        <header class="header">
            <h2><slot></slot></h2>
        </header>
        <article class="meta_row">
            <p class="label">
                ID
                <Tooltip content="Unique character string generated when a transaction is executed"></Tooltip>
            </p>
            <div class="genesis_tx">
                <p>
                    <b>{{txId}}</b>
                    <CopyText :value="`${txId}`" class="copy_but"></CopyText>
                </p>
                <p v-if="isAssetGenesis" class="genesis">Asset Genesis</p>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">
                Status
                <Tooltip content="Status of the transaction"></Tooltip>
            </p>
            <div>
                <p class="status">Success</p>
                <p class="status" v-if="type==='assetCreation'">Success</p>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">
                Timestamp
                <Tooltip content="Date and time when the transaction was processed"></Tooltip>
            </p>
            <p class="date">
                <fa :icon="['far','clock']"></fa>
                {{dateAgo}} ({{date.toLocaleString()}})
            </p>
        </article>
        <article class="meta_row">
            <p class="label">
                Value
                <Tooltip content="Total economic value transferred in this transaction"></Tooltip>
            </p>
            <p class="values">
                <span
                    v-for="(val, id) in outValuesDenominated"
                    :key="id"
                >{{val.amount}} <b>{{val.symbol}}</b></span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">
                Transaction Fee
                <Tooltip content="Amount paid to validators for processing the transaction"></Tooltip>
            </p>
            <!-- TODO: Tx Fee from API when supported -->
            <p>0.001 AVAX</p>
        </article>
        <article class="meta_row" v-if="isMemo">
            <p class="label">
                Memo
                <Tooltip content="A 256-byte memo field for encoding arbitrary data"></Tooltip>
            </p>
            <div>
                <p><span class="decode">hex</span> {{memo_hex}}</p>
                <p><span class="decode">UTF-8</span> {{memo_utf8}}</p>
            </div>
        </article>
        <article class="meta_row" v-if="!isAssetGenesis">
            <p class="label">
                Input UTXOs
            </p>
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
            <p class="label">
                Output UTXOs
            </p>
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
import CopyText from "@/components/misc/CopyText.vue";
import Loader from "@/components/misc/Loader.vue";
import UtxoRow from "@/components/Transaction/UtxoRow.vue";
import { Transaction } from "../js/Transaction";
import {
    ITransactionOutput,
    OutputValuesDict,
    outValuesDenominated
} from "../js/ITransaction";
import { bigToDenomString, stringToBig } from "../helper";
import Big from "big.js";
import moment from "moment";
import Tooltip from "@/components/rows/Tooltip.vue";

@Component({
    components: {
        UtxoRow,
        Tooltip,
        CopyText
    }
})
export default class TransactionDetailCard extends Vue {
    @Prop() tx!: Transaction;

     b64DecodeHex(str: string): string {
        const raw = atob(str);
        let result = "";
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : "0" + hex);
        }
        return result.toUpperCase();
    }

    b64EncodeUnicode(str: string): string {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(parseInt(("0x" + p1)));
        }));
    }

    b64DecodeUnicode(str: string): string {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
    }

    get memo_hex(): string {
        return this.b64DecodeHex(this.tx.memo);
    }

    get memo_utf8(): string {
        return this.b64DecodeUnicode(this.tx.memo);
    }

    get isMemo(): boolean {
        return (this.tx.memo === "" || null) ? false : true;
    }

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

.decode {
    display: inline-block;
    color: main.$primary-color-light;
    width: 60px;
    font-size: 12px;
}
</style>