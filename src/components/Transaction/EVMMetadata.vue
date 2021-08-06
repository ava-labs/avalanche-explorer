<template>
    <section class="stats">
        <article class="meta_row">
            <p class="meta_label">
                ID
                <Tooltip content="Unique Identifier of this transaction" />
            </p>
            <div class="meta_value values">
                {{ tx.hash }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Block
                <Tooltip
                    content="The number of the block in which the transaction was recorded."
                />
            </p>
            <div class="meta_value values">
                <Block :number="tx.block" :link="true" />
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Timestamp
                <Tooltip
                    content="The date and time when this transaction was accepted by the Avalanche Network"
                />
            </p>
            <div class="meta_value values">
                <Timestamp :timestamp="tx.createdAt" />
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Type
                <Tooltip content="Type of EVM transaction" />
            </p>
            <div class="meta_value values">{{ tx.type }} Tx</div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                From
                <Tooltip content="The sending account of the transaction" />
            </p>
            <div class="meta_value values">
                <router-link :to="`/evmaddress/${tx.fromAddr}`">{{
                    tx.fromAddr
                }}</router-link>
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                To
                <Tooltip
                    content="The receiving account of the transaction (could be a contract address)."
                />
            </p>
            <div class="meta_value values">
                <router-link :to="`/evmaddress/${tx.toAddr}`">
                    <template v-if="tx.toName !== null">
                        {{ tx.toName }} (</template
                    >
                    {{ tx.toAddr
                    }}<template v-if="tx.toName !== null">) </template>
                </router-link>
            </div>
        </article>
        <article v-if="tx.type === 'Call'" class="meta_row">
            <p class="meta_label">
                Input
                <Tooltip
                    content="Additional information that is required for the transaction."
                />
            </p>
            <div class="meta_value values breakall monospace">
                <p v-if="tx.toName !== undefined">{{ tx.inputDecoded }}</p>
                {{ tx.input }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Value
                <Tooltip content="The value being transacted in AVAX." />
            </p>
            <div class="meta_value values">
                {{ tx.value }} {{ nativeSymbol }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Price
                <Tooltip
                    content="Cost per unit of gas specified for the transaction, in AVAX and nAVAX."
                />
            </p>
            <div class="meta_value values">
                {{ tx.gasPrice }} {{ nativeSymbol }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Gas Limit
                <Tooltip
                    content="Maximum amount of gas provided for the transaction. For normal AVAX transfers, the value is 21,000. For contract calls, this value is higher and bound by block gas limit."
                />
            </p>
            <div class="meta_value values">
                {{ tx.gasLimit }}
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import Block from '@/components/EVM/Block.vue'
import Timestamp from '@/components/EVM/Timestamp.vue'
import { getAssetType } from '@/services/assets'
import { getMappingForType } from '@/store/modules/transactions/maps'
import { EVMTransactionResponse } from '@/store/modules/transactions/models'
import { AVAX_ID } from '@/known_assets'

@Component({
    components: {
        Tooltip,
        Block,
        Timestamp,
    },

    filters: {
        getType: getMappingForType,
        getAssetType,
    },
})
export default class EVMMetadata extends Vue {
    @Prop() tx!: EVMTransactionResponse

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get nativeSymbol() {
        return this.$store.state.assets[AVAX_ID].symbol
    }
}
</script>

<style scoped lang="scss"></style>
