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
                <div class="block_link">
                    <router-link
                        v-if="block.number > 0"
                        :to="`/evmblock/${block.number - 1}`"
                    >
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <fa
                                    icon="arrow-left"
                                    color="#c4c4c4"
                                    v-on="on"
                                ></fa>
                            </template>
                            <div>
                                <p>
                                    {{ block.number - 1 }}
                                </p>
                            </div>
                        </v-tooltip>
                    </router-link>
                </div>
                <div class="block_link">
                    <router-link :to="`/evmblock/${block.number + 1}`">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <fa
                                    icon="arrow-right"
                                    color="#c4c4c4"
                                    v-on="on"
                                ></fa>
                            </template>
                            <div>
                                <p>
                                    {{ block.number + 1 }}
                                </p>
                            </div>
                        </v-tooltip>
                    </router-link>
                </div>
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
                <Tooltip content="" />
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

<style scoped lang="scss">
.block_link {
    display: inline-block;
    line-height: 1em;

    &:first-of-type {
        margin-left: 30px;
        margin-right: 30px;
    }
}
</style>
