<template>
    <section class="stats">
        <article class="meta_row">
            <p class="meta_label">
                Block
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.blockNumber }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Accepted
                <Tooltip content="This block's inception date and time." />
            </p>
            <div class="meta_value values">
                {{ block.header.timestamp }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Version
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.version }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Limit
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.gasLimit }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Used
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.gasUsed }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Parent Hash
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.parentHash }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                SHA3 Uncles
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.sha3Uncles }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Parent Hash
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.parentHash }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                State Root
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.stateRoot }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Tx Root
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.transactionsRoot }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Receipts Root
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.receiptsRoot }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Logs Bloom
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.logsBloom }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Difficulty
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.difficulty }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Number
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.number }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Extra Data
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.extraData }}
            </div>
        </article>

        <article class="meta_row">
            <p class="meta_label">
                Nonce
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.nonce }}
            </div>
        </article>
        <!-- MORE INFO -->
        <article class="meta_row">
            <p class="meta_label">
                Extra Data Hash
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.extDataHash }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Mix Hash
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.mixHash }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Hash
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header.hash }}
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import { EVMBlockQueryResponse } from '@/store/modules/blocks'

@Component({
    components: {
        Tooltip,
    },
    filters: {},
})
export default class EVMMetadata extends Vue {
    @Prop() block!: EVMBlockQueryResponse
    // get date(): Date {
    //     return new Date(this.block.timestamp)
    // }
}
</script>

<style scoped lang="scss"></style>
