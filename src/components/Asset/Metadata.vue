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
            <p class="meta_value">{{ genesisTx | getAssetType }}</p>
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
                {{ asset.chainID | blockchain }}
            </p>
        </article>
        <!-- FUNGIBLE ONLY -->
        <article v-if="!isNFT" class="meta_row">
            <p class="meta_label">
                Minimal Transferrable Unit
                <TooltipMeta
                    :content="'determines how balances of this asset are displayed'"
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
        <!-- STATS -->
        <article v-if="!isNFT" class="meta_row">
            <p class="meta_label">
                24h Volume
                <TooltipMeta
                    :content="
                        'Total value of ' +
                        asset.symbol +
                        ' transferred on Avalanche in the past 24 hours'
                    "
                />
            </p>
            <p class="meta_value">
                {{ parseInt(asset.volume_day.toFixed(0)).toLocaleString() }}
                <span class="unit">{{ asset.symbol }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                24h Tx
                <TooltipMeta
                    :content="
                        'Total number of state queries or modifications of blockchains involving ' +
                        asset.symbol +
                        ' in the past 24 hours'
                    "
                />
            </p>
            <p class="meta_value">
                {{ asset.txCount_day.toLocaleString() }}
            </p>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import TooltipMeta from '@/components/misc/TooltipMeta.vue'
import TransactionHistory from '@/components/Home/TopInfo/TransactionHistory.vue'
import { Transaction } from '@/js/Transaction'
import { getAssetType } from '@/services/assets'

@Component({
    components: {
        TooltipMeta,
        TransactionHistory,
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
}
</script>

<style scoped lang="scss"></style>
