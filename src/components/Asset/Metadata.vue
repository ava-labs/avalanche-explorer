<template>
    <section class="meta">
        <!-- INFO -->
        <article v-if="asset.alias" class="meta_row">
            <p class="meta_label">
                Alias
                <TooltipMeta :content="'Alias of ' + asset.id" />
            </p>
            <p class="meta_value">
                {{ asset.alias }}
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                ID
                <TooltipMeta :content="'Unique identifier of token'" />
            </p>
            <p class="meta_value">
                <router-link :to="`/tx/${asset.id}`">{{
                    asset.id
                }}</router-link>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Asset Type
                <TooltipMeta
                    content="The type of asset (NFT, variable or fixed cap)"
                />
            </p>
            <p class="meta_value">{{ asset | getAssetType }}</p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Created
                <TooltipMeta
                    :content="'When and where ' + asset.symbol + ' was minted'"
                />
            </p>
            <p class="meta_value">
                <fa :icon="['far', 'clock']" class="time_icon"></fa>
                {{ date | fromNow }} ({{ date.toLocaleString() }}) on
                <span
                    class="chain_tag"
                    :style="{ backgroundColor: background }"
                    >{{ asset.chainID | blockchain }}</span
                >
            </p>
        </article>
        <!-- FUNGIBLE ONLY -->
        <article v-if="!isNFT" class="meta_row">
            <p class="meta_label">
                Unit
                <TooltipMeta
                    :content="'minimal transferable unit of this asset'"
                />
            </p>
            <p class="meta_value">
                {{ minimalTransferrableUnit }} ({{
                    asset.denomination | pluralizeDenomination
                }})
            </p>
        </article>
        <article v-if="!isNFT" class="meta_row">
            <p class="meta_label">
                Initial Supply
                <TooltipMeta :content="'Type of asset'" />
            </p>
            <p class="meta_value">
                {{ asset.currentSupply.toLocaleString(asset.denomination) }}
                <span class="unit">{{ asset.symbol }}</span>
            </p>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import TooltipMeta from '@/components/misc/TooltipMeta.vue'
import { Transaction } from '@/js/Transaction'
import { getAssetType } from '@/services/assets'
import { backgroundColor } from '@/helper'
import { getTxChainType } from '@/known_blockchains'

@Component({
    components: {
        TooltipMeta,
    },
    filters: {
        getAssetType,
    },
})
export default class Metadata extends Vue {
    @Prop() asset!: Asset
    @Prop() genesisTx!: Transaction

    get minimalTransferrableUnit() {
        const power = -1 * this.asset.denomination
        return Math.pow(10, power).toFixed(this.asset.denomination)
    }

    get isNFT() {
        return this.asset.nft === 1
    }

    get date(): Date {
        return new Date(this.genesisTx.timestamp)
    }

    get background(): string {
        const chain = getTxChainType(this.asset.chainID)
        return chain ? backgroundColor(chain.code) : '#fff'
    }
}
</script>

<style scoped lang="scss"></style>
