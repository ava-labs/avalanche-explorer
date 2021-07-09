<template>
    <section class="stats">
        <article class="meta_row">
            <p class="meta_label">
                Block
                <Tooltip
                    content="A scalar value equal to the number of ancestor blocks."
                />
            </p>
            <div class="meta_value values">
                {{ block.number }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Accepted
                <Tooltip content="This block's inception date and time." />
            </p>
            <div class="meta_value values">
                <p class="date">
                    <fa :icon="['far', 'clock']" class="time_icon"></fa>
                    <span class="timestamp"
                        >{{ date | fromNow }} ({{
                            date.toLocaleString()
                        }})</span
                    >
                </p>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Transactions
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.transactions.length | pluralize('transaction') }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Atomic Txs
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{
                    block.atomicTransactions.length
                        | pluralize('cross-chain transfer')
                }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Used
                <Tooltip
                    content="A scalar value equal to the total gas used by all transactions in this block."
                />
            </p>
            <div class="meta_value values">
                {{ block.gasUsed.toLocaleString() }} gas
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Limit
                <Tooltip
                    content="A scalar value equal to the current limit of gas expenditure per block."
                />
            </p>
            <div class="meta_value values">
                {{ block.gasLimit.toLocaleString() }} gas
            </div>
        </article>

        <!-- MODIFIED MERKLE PATRICIA TREE -->
        <article class="meta_row">
            <p class="meta_label">
                Hash
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.hash }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Parent Hash
                <Tooltip
                    content="Relates a block to its parent in the chain. It always points to the block with a number that is decreased by one, compared to the block it originates from. "
                />
            </p>
            <div class="meta_value values">
                {{ block.parentHash }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                State Root
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.stateRoot }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Tx Root
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.transactionsRoot }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Receipts Root
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.receiptsRoot }}
            </div>
        </article>
        <!-- LOGS -->
        <!-- <article class="meta_row">
            <p class="meta_label">
                Logs Bloom
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.logsBloom }}
            </div>
        </article> -->
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'

@Component({
    components: {
        Tooltip,
    },
    filters: {},
})
export default class EVMMetadata extends Vue {
    @Prop() block!: any
    get date(): Date {
        return new Date(this.block.timestamp)
    }
}
</script>

<style scoped lang="scss"></style>
