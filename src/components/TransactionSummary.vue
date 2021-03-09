<template>
    <section v-if="tx" class="card meta">
        <header class="header">
            <h2><slot></slot></h2>
        </header>
        <!-- SUMMARY -->
        <article class="meta_row">
            <p class="label">
                ID
                <Tooltip
                    content="Unique character string generated when a transaction is executed"
                ></Tooltip>
            </p>
            <div class="genesis_tx">
                <p>
                    <b>{{ tx.id }}</b>
                    <CopyText :value="`${tx.id}`" class="copy_but"></CopyText>
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
                <p v-if="tx.type === 'assetCreation'" class="status">Success</p>
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
                {{ date | fromNow }} ({{ date.toLocaleString() }})
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
                Type
                <Tooltip content="The transaction type"></Tooltip>
            </p>
            <p class="values">
                {{ tx.type | getType }}
            </p>
        </article>
        <article class="meta_row">
            <p class="label">
                Transaction Fee
                <Tooltip
                    content="Amount paid to validators for processing the transaction"
                ></Tooltip>
            </p>
            <p>{{ tx.txFee | toAVAX }} AVAX</p>
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
        <article class="meta_row">
            <p class="label">
                Asset Type
                <Tooltip
                    content="The type of asset (NFT, variable or fixed cap)"
                ></Tooltip>
            </p>
            <div>
                <p>{{ tx | getAssetType }}</p>
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import UtxoRow from '@/components/Transaction/UtxoRow.vue'
import {
    getMappingForType,
    Transaction,
    getTransactionOutputs,
} from '../js/Transaction'
import {
    OutputValuesDict,
    OutValuesDenominated,
} from '@/store/modules/transactions/models'
import { stringToBig, toAVAX } from '../helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import { getAssetType } from '@/services/assets'

@Component({
    components: {
        UtxoRow,
        Tooltip,
        CopyText,
    },
    filters: {
        getType: getMappingForType,
        toAVAX,
        getAssetType,
    },
})
export default class TransactionSummary extends Vue {
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

    get outputs() {
        return getTransactionOutputs(this.tx.outputs, this.tx.chainID)
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

    get isAssetGenesis(): boolean {
        return this.tx.type === 'create_asset'
    }

    get date(): Date {
        return new Date(this.tx.timestamp)
    }

    get assets(): any {
        return this.$store.state.assets
    }

    get outValues(): OutputValuesDict {
        const dict: OutputValuesDict = {}
        const outs = this.tx.outputs

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
        const outValuesDenominated: OutValuesDenominated = {}
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
