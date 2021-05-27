<template>
    <section class="stats">
        <article class="meta_row">
            <p class="meta_label">
                Accepted
                <Tooltip
                    content="The time when this transaction was accepted by the Explorer Node"
                />
            </p>
            <div class="meta_value values">
                <p class="date">
                    <fa :icon="['far', 'clock']" class="time_icon"></fa>
                    <span class="timestamp"
                        >{{ date | fromNow }} ({{
                            date.toLocaleString()
                        }})</span
                    >
                    <span class="status">Success</span>
                    <span v-if="tx.type === 'assetCreation'" class="status"
                        >Asset Creation Success</span
                    >
                </p>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Value
                <Tooltip content="The value transferred in this transaction" />
            </p>
            <div class="meta_value values">
                <p
                    v-for="(val, id) in outValuesDenominated"
                    :key="id"
                    class="asset_value"
                >
                    {{ val.amount }}
                    <span class="unit">{{ val.symbol }}</span>
                    <span v-if="assetsLoaded" class="asset_type">{{
                        asset(val.assetID) | getAssetType
                    }}</span>
                </p>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Burned
                <Tooltip content="The fee to process this transaction" />
            </p>
            <p class="meta_value">
                {{ tx.txFee | toAVAX }}
                <span class="unit">AVAX</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Blockchain
                <Tooltip content="The blockchain for this transaction" />
            </p>
            <div class="meta_value">
                <span
                    class="chain_tag"
                    :style="{ backgroundColor: background }"
                >
                    {{ chain }}
                </span>
                <div v-if="isPChain" style="margin-top: 10px">
                    <div class="summary_label">Block</div>
                    <div>{{ tx.txBlockId }}</div>
                </div>
            </div>
        </article>
        <!-- MEMO -->
        <article v-if="isMemo" class="meta_row">
            <p class="meta_label">
                Memo
                <Tooltip
                    content="A 256-byte text field for encoding arbitrary data associated with this transaction"
                />
            </p>
            <div class="meta_value">
                <Memo :tx="tx" />
            </div>
        </article>
        <!-- STAKING -->
        <article v-if="isStaking" class="meta_row">
            <p class="meta_label">
                Staking
                <Tooltip
                    content="Validator Rewards for this transaction"
                    color="#c4c4c4"
                />
            </p>
            <div class="meta_value">
                <StakingSummary :tx="tx" />
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import TransactionHistory from '@/components/Home/TopInfo/TransactionHistory.vue'
import { getAssetType } from '@/services/assets'
import { getTxChainType } from '@/known_blockchains'
import { getMappingForType } from '@/store/modules/transactions/maps'
import { backgroundColor, stringToBig, toAVAX } from '@/helper'
import { Transaction, getTransactionOutputs } from '@/js/Transaction'
import { P } from '@/known_blockchains'
import {
    OutputValuesDict,
    OutValuesDenominated,
} from '@/store/modules/transactions/models'
import StakingSummary from '@/components/Transaction/StakingSummary.vue'
import Memo from '@/components/Transaction/Memo.vue'
import Big from 'big.js'

@Component({
    components: {
        Tooltip,
        TransactionHistory,
        Memo,
        StakingSummary,
    },

    filters: {
        getType: getMappingForType,
        toAVAX,
        getAssetType,
    },
})
export default class Metadata extends Vue {
    @Prop() tx!: Transaction
    @Prop() isMemo!: boolean
    @Prop() isStaking!: boolean

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get date(): Date {
        return new Date(this.tx.timestamp)
    }

    get chain(): string {
        return getTxChainType(this.tx.chainID)!.name
    }

    get isPChain() {
        return this.tx.chainID === P.id ? true : false
    }

    get assets(): any {
        return this.$store.state.assets
    }

    get outputs() {
        return getTransactionOutputs(this.tx.outputs)
    }

    // a map of unique assets and their total amounts trasferred in this tx
    get outValues(): OutputValuesDict {
        const dict: OutputValuesDict = {}
        const outs = this.tx.outputs

        outs.forEach((out) => {
            const assetID = out.assetID
            const asset = this.assets[assetID]

            let denomination = 0
            let symbol = assetID
            let isNFT = false

            // look up the asset and set props
            if (asset) {
                denomination = asset.denomination
                symbol = asset.symbol
                isNFT = !!asset.nft
            } else {
                this.$store.dispatch('addUnknownAsset', assetID)
            }

            // amount is based on fungibility
            const amount = isNFT ? Big(1) : out.amount

            // create totals object for each unique asset
            if (!dict[assetID]) {
                dict[assetID] = {
                    symbol,
                    amount: amount,
                    denomination,
                    isNFT,
                }
            }
            // if object already exists, update the amount
            else {
                const valNow = dict[assetID].amount
                dict[assetID].amount = valNow.plus(amount)
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
                assetID: assetId,
                isNFT: val.isNFT,
            }
        }
        return outValuesDenominated
    }

    get background(): string {
        return backgroundColor(this.chain)
    }

    asset(id: string) {
        return this.$store.state.assets[id]
    }
}
</script>

<style scoped lang="scss"></style>
