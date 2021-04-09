<template>
    <section class="stats">
        <article v-if="asset.alias">
            <div class="meta_row">
                <p class="label">
                    Alias
                    <TooltipMeta :content="'Alias of ' + asset.id" />
                </p>
                <p class="meta_val">
                    {{ asset.alias }}
                </p>
            </div>
        </article>
        <article v-if="asset.alias">
            <div class="meta_row">
                <p class="label">
                    ID
                    <TooltipMeta :content="'Unique identifier of token'" />
                </p>
                <p class="meta_val">
                    {{ asset.id }}
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    24h Volume
                    <TooltipMeta
                        :content="
                            'Total value of ' +
                            asset.symbol +
                            ' transferred on Avalanche in the past 24 hours'
                        "
                    />
                </p>
                <p class="meta_val">
                    {{ parseInt(asset.volume_day.toFixed(0)).toLocaleString() }}
                    <span class="unit">{{ asset.symbol }}</span>
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    24h Tx
                    <TooltipMeta
                        :content="
                            'Total number of state queries or modifications of blockchains involving ' +
                            asset.symbol +
                            ' in the past 24 hours'
                        "
                    />
                </p>
                <p class="meta_val">
                    {{ asset.txCount_day.toLocaleString() }}
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    Minted On
                    <TooltipMeta
                        :content="
                            'Blockchain where ' + asset.symbol + ' was minted'
                        "
                    />
                </p>
                <p class="meta_val">
                    {{ asset.chainID | blockchain }}
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    Initial Supply
                    <TooltipMeta
                        :content="
                            'Initial value of ' + asset.symbol + ' minted'
                        "
                    />
                </p>
                <p class="meta_val">
                    {{ asset.currentSupply.toLocaleString(asset.denomination) }}
                    <span class="unit">{{ asset.symbol }}</span>
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    Minimal Transferrable Unit
                    <TooltipMeta
                        :content="'determines how balances of this asset are displayed'"
                    />
                </p>
                <p class="meta_val">
                    {{ minimalTransferrableUnit }} ({{
                        asset.denomination | pluralizeDenomination
                    }})
                </p>
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import TooltipMeta from '@/components/misc/TooltipMeta.vue'
import TransactionHistory from '@/components/Home/TopInfo/TransactionHistory.vue'

@Component({
    components: {
        TooltipMeta,
        TransactionHistory,
    },
})
export default class Metadata extends Vue {
    @Prop() asset!: Asset

    get minimalTransferrableUnit() {
        const power = -1 * this.asset.denomination
        return Math.pow(10, power).toFixed(this.asset.denomination)
    }
}
</script>

<style scoped lang="scss"></style>
