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
                <Block :number="block.number" />
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Accepted
                <Tooltip content="This block's inception date and time." />
            </p>
            <div class="meta_value values">
                <Timestamp :timestamp="block.timestamp" />
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Transactions
                <Tooltip
                    content="The number of transactions contained in this block."
                />
            </p>
            <div class="meta_value values">
                <template v-if="block.transactions.length === 0"
                    >There are no transactions for this block.</template
                >
                <template v-else>
                    {{ block.transactions.length | pluralize('transaction') }}
                </template>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Atomic Txs
                <Tooltip
                    content="The number of atomic transfers contained in this block."
                />
            </p>
            <div class="meta_value values">
                <template v-if="block.atomicTransactions.length === 0"
                    >There are no atomic transactions for this block.</template
                >
                <template v-else>{{
                    block.atomicTransactions.length
                        | pluralize('cross-chain transfer')
                }}</template>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Used
                <Tooltip
                    content="The total gas used by all transactions in this block."
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
                    content="The current limit of gas expenditure per block."
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
                <Tooltip content="The hash of this block." />
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
import Block from '@/components/EVM/Block.vue'
import Timestamp from '@/components/EVM/Timestamp.vue'

@Component({
    components: {
        Tooltip,
        Block,
        Timestamp,
    },
    filters: {},
})
export default class EVMMetadata extends Vue {
    @Prop() block!: any
}
</script>

<style scoped lang="scss"></style>
