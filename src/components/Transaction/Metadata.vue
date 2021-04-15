<template>
    <section class="stats">
        <article class="meta_row">
            <p class="meta_label">
                Status
                <Tooltip content="Status of the transaction" />
            </p>
            <div class="meta_value">
                <p class="status">Success</p>
                <p v-if="tx.type === 'assetCreation'" class="status">Success</p>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Accepted
                <Tooltip
                    content="Date and time when transaction was accepted"
                />
            </p>
            <div class="meta_values values">
                <p class="date">
                    <fa :icon="['far', 'clock']" class="time_icon"></fa>
                    {{ date | fromNow }} ({{ date.toLocaleString() }})
                </p>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Value
                <Tooltip
                    content="Total economic value transferred in this transaction"
                />
            </p>
            <p class="meta_value values">
                <span v-for="(val, id) in outValuesDenominated" :key="id"
                    >{{ val.amount }} <b>{{ val.symbol }}</b></span
                >
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Transaction Fee
                <Tooltip
                    content="Amount paid to validators for processing the transaction"
                />
            </p>
            <p class="meta_value">{{ tx.txFee | toAVAX }} AVAX</p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Blockchain
                <Tooltip content="Blockchain storing transaction" />
            </p>
            <div class="meta_value">
                <p>{{ chain }}</p>
                <div v-if="isPChain" style="margin-top: 10px">
                    <div class="summary_label">Block</div>
                    <div>{{ tx.txBlockId }}</div>
                </div>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Asset Type
                <Tooltip
                    content="The type of asset (NFT, variable or fixed cap)"
                />
            </p>
            <div class="meta_value">
                <p>{{ tx | getAssetType }}</p>
            </div>
        </article>
        <!-- MEMO -->
        <article v-if="isMemo" class="meta_row">
            <p class="meta_label">
                Memo
                <Tooltip
                    content="A 256-byte text field for encoding arbitrary data"
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
                <Tooltip content="Validator Rewards" color="#c4c4c4" />
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
import { stringToBig, toAVAX } from '../../helper'
import { Transaction, getTransactionOutputs } from '@/js/Transaction'
import { P } from '@/known_blockchains'
import {
    OutputValuesDict,
    OutValuesDenominated,
} from '@/store/modules/transactions/models'
import StakingSummary from '@/components/Transaction/StakingSummary.vue'
import Memo from '@/components/Transaction/Memo.vue'

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

<style scoped lang="scss"></style>
