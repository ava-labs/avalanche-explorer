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
                <router-link :to="`/evmblock/${tx.block}`">{{
                    tx.block
                }}</router-link>
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
                {{ tx.createdAt }}
            </div>
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
                <router-link :to="`/evmaddress/${tx.toAddr}`">{{
                    tx.toAddr
                }}</router-link>
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
                Input
                <Tooltip
                    content="Additional information that is required for the transaction."
                />
            </p>
            <div class="meta_value values">
                {{ tx.input }}
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
import { getAssetType } from '@/services/assets'
import { getMappingForType } from '@/store/modules/transactions/maps'
import { EVMTransactionResponse } from '@/store/modules/transactions/models'
import { AVAX_ID } from '@/known_assets'

@Component({
    components: {
        Tooltip,
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
