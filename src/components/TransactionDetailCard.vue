<template>
    <section v-if="tx" class="card meta">
        <header class="header">
            <h2><slot></slot></h2>
        </header>
        <article class="meta_row">
            <p class="label">
                ID
                <Tooltip
                    content="Unique character string generated when a transaction is executed"
                ></Tooltip>
            </p>
            <div class="genesis_tx">
                <p>
                    <b>{{ txId }}</b>
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
                <p v-if="type === 'assetCreation'" class="status">Success</p>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">
                Timestamp
                <Tooltip
                    content="Date and time when the transaction was processed"
                ></Tooltip>
            </p>
            <p class="date">
                <fa :icon="['far', 'clock']"></fa>
                {{ dateAgo }} ({{ date.toLocaleString() }})
            </p>
        </article>
        <article class="meta_row">
            <p class="label">
                Value
                <Tooltip
                    content="Total economic value transferred in this transaction"
                ></Tooltip>
            </p>
            <p class="values">
                <span v-for="(val, id) in outValuesDenominated" :key="id"
                    >{{ val.amount }} <b>{{ val.symbol }}</b></span
                >
            </p>
        </article>
        <article class="meta_row">
            <p class="label">
                Transaction Fee
                <Tooltip
                    content="Amount paid to validators for processing the transaction"
                ></Tooltip>
            </p>
            <!-- TODO: Tx Fee from API when supported -->
            <p>0.001 AVAX</p>
        </article>
        <article v-if="isText" class="meta_row">
            <p class="label">
                Text
                <Tooltip
                    content="A 256-byte text field for encoding arbitrary data"
                ></Tooltip>
            </p>
            <div>
                <p><span class="decode">hex</span> {{ text_hex }}</p>
                <p><span class="decode">UTF-8</span> {{ text_utf8 }}</p>
            </div>
        </article>
        <article v-if="!isAssetGenesis" class="meta_row">
            <p class="label">Input UTXOs</p>
            <div v-if="inputs.length > 0">
                <div class="utxo_headers">
                    <p>Tx</p>
                    <p></p>
                    <p>Lock Time</p>
                    <p>Threshold</p>
                    <p>From</p>
                    <p class="amount">Amount</p>
                </div>
                <utxo-row
                    v-for="(input, i) in inputs"
                    :key="i"
                    class="io_item"
                    :utxo="input"
                    type="input"
                ></utxo-row>
            </div>
            <div v-else>
                <p>
                    No input UTXOs found for this transaction on the Avalanche
                    Explorer.
                </p>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">Output UTXOs</p>
            <div v-if="outputs.length > 0">
                <div class="utxo_headers">
                    <p>Tx</p>
                    <p></p>
                    <p>Lock Time</p>
                    <p>Threshold</p>
                    <p>To</p>
                    <p class="amount">Amount</p>
                </div>
                <utxo-row
                    v-for="(output, i) in outputs"
                    :key="i"
                    class="io_item"
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
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import UtxoRow from '@/components/Transaction/UtxoRow.vue'
import { Transaction } from '../js/Transaction'
import {
    ITransactionOutput,
    OutputValuesDict,
    OutputValuesDenominated,
} from '../js/ITransaction'
import { stringToBig } from '../helper'
import moment from 'moment'
import Tooltip from '@/components/rows/Tooltip.vue'

@Component({
    components: {
        UtxoRow,
        Tooltip,
        CopyText,
    },
})
export default class TransactionDetailCard extends Vue {
    @Prop() tx!: Transaction

    b64DecodeHex(str: string): string {
        const raw = atob(str)
        let result = ''
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16)
            result += hex.length === 2 ? hex : '0' + hex
        }
        return result.toUpperCase()
    }

    b64EncodeUnicode(str: string): string {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(
            encodeURIComponent(str).replace(
                /%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode(parseInt('0x' + p1))
                }
            )
        )
    }

    b64DecodeUnicode(str: string): string {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(
            atob(str)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join('')
        )
    }

    get text_hex(): string {
        return this.b64DecodeHex(this.tx.memo)
    }

    get text_utf8(): string {
        return this.b64DecodeUnicode(this.tx.memo)
    }

    get isText(): boolean {
        return this.tx.memo === '' || null ? false : true
    }

    get txId(): string {
        return this.tx.id
    }

    get chainId(): string {
        return this.tx.chainID
    }

    get inputs(): ITransactionOutput[] {
        const res: ITransactionOutput[] = []
        const ins = this.tx.inputs

        if (!ins) return res

        for (let i = 0; i < ins.length; i++) {
            res.push(ins[i].output)
        }
        return res
    }

    get isAssetGenesis(): boolean {
        return this.type === 'create_asset'
    }

    get outputs(): ITransactionOutput[] {
        return this.tx.outputs
    }

    get type(): string {
        return this.tx.type
    }

    get date(): Date {
        return new Date(this.tx.timestamp)
    }

    get dateAgo(): string {
        return moment(this.date).fromNow()
    }

    get assets(): any {
        return this.$store.state.assets
    }

    get outValues(): OutputValuesDict {
        const dict: OutputValuesDict = {}
        const outs = this.outputs

        outs.forEach((out) => {
            const assetID = out.assetID
            const amount = out.amount
            const asset = this.assets[assetID]
            let denomination = 0
            let symbol = assetID
            if (asset) {
                denomination = asset.denomination
                symbol = asset.symbol
            } else {
                this.$store.dispatch('addUnknownAsset', assetID)
            }
            if (dict[assetID]) {
                const valNow = dict[assetID].amount
                dict[assetID].amount = valNow.plus(amount)
            } else {
                dict[assetID] = {
                    symbol,
                    amount,
                    denomination,
                }
            }
        })
        return dict
    }

    get outValuesDenominated() {
        const outValuesDenominated: OutputValuesDenominated = {}
        for (const assetId in this.outValues) {
            const val = this.outValues[assetId]
            const res = stringToBig(
                val.amount.toString(),
                val.denomination
            ).toLocaleString(val.denomination)
            outValuesDenominated[assetId] = {
                amount: res,
                symbol: val.symbol,
            }
        }
        return outValuesDenominated
    }
}
</script>

<style scoped lang="scss">
.decode {
    display: inline-block;
    color: $primary-color-light;
    width: 60px;
    font-size: 12px;
}
</style>
