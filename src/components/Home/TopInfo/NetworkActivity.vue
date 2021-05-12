<template>
    <div id="network_statistics" class="card">
        <div class="header">
            <h2 class="top_info_heading">Avalanche Network Activity</h2>
        </div>
        <section class="stats one-column">
            <!-- <article class="meta">
                <router-link class="stat" to="/tx">
                    <dd class="label">
                        24h Transactions
                        <TooltipMeta
                            content="Total number of state queries or modifications of all blockchains on Avalanche in the past 24 hours"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt class="meta_val" v-if="assetsLoaded">
                        {{totalTransactions.toLocaleString()}}
                        <span class="unit">{{tpmText}} TPM</span>
                    </dt>
                    <v-progress-circular v-else :size="16" :width="2" color="#E84970" indeterminate key="1"/>                    
                </router-link>
            </article> -->
            <article class="meta">
                <router-link class="stat" to="/assets">
                    <dd class="label">
                        24h Volume
                        <TooltipMeta
                            content="Total value of AVAX transferred on Avalanche in the past 24 hours"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt v-if="assetsLoaded" class="meta_val">
                        {{ avaxVolume }}
                        <span class="unit">AVAX</span>
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
        </section>
        <section class="stats two-column">
            <article class="meta">
                <router-link class="stat" to="/validators">
                    <dd class="label">
                        Validators
                        <TooltipMeta
                            content="Total number of nodes validating transactions on Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt v-if="subnetsLoaded" class="meta_val">
                        {{ validatorCount.toLocaleString() }}
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/validators">
                    <dd class="label">
                        Total Staked
                        <TooltipMeta
                            content="Total value of AVAX locked to secure Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt class="meta_val" v-if="subnetsLoaded">
                        {{ totalStake }}
                        <span class="unit">AVAX</span>
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/blockchains">
                    <dd class="label">
                        Blockchains
                        <TooltipMeta
                            content="Total number of blockchains on Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt v-if="subnetsLoaded" class="meta_val">
                        {{ totalBlockchains }}
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/subnets">
                    <dd class="label">
                        Subnets
                        <TooltipMeta
                            content="Total number of subnets on Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt v-if="subnetsLoaded" class="meta_val">
                        {{ totalSubnets }}
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/subnets">
                    <dd class="label">
                        Staking Ratio
                        <TooltipMeta
                            content="Percentage of AVAX locked to secure Avalanche out of total AVAX supply (360m)"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt v-if="subnetsLoaded" class="meta_val">
                        {{ percentStaked }}%
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/subnets">
                    <dd class="label">Annual Staking Reward</dd>
                    <dt v-if="subnetsLoaded" class="meta_val">
                        {{ annualStakingRewardPercentage }}
                    </dt>
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </router-link>
            </article>
        </section>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component, Watch } from 'vue-property-decorator'
import TooltipHeading from '@/components/misc/TooltipHeading.vue'
import TooltipMeta from '@/components/Home/TopInfo/TooltipMeta.vue'
import { AVAX_ID } from '@/known_assets'
import { Asset } from '@/js/Asset'
import Big from 'big.js'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'

@Component({
    components: {
        TooltipHeading,
        TooltipMeta,
    },
})
export default class NetworkActivity extends Mixins(PlatformGettersMixin) {
    volumeCache: Big = Big(0)
    totalTransactionsCache = 0

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get assetAggregatesLoaded(): boolean {
        return this.$store.state.assetAggregatesLoaded
    }

    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded
    }

    @Watch('avaxVolume')
    onAvaxVolumeChanged() {
        this.saveCacheAvax()
    }

    @Watch('totalTransactions')
    ontotalTransactionsChanged() {
        this.saveCacheTotalTransactions()
    }

    created() {
        // Get 24h volume cache
        // TODO: remove when API is enhanced
        const volumeCacheJSON = localStorage.getItem('avaxCache')
        let volumeCache = Big(0)
        if (volumeCacheJSON) {
            const cache = JSON.parse(volumeCacheJSON)
            volumeCache = Big(cache.volume_day)
        }
        this.volumeCache = volumeCache

        // Get totalTransactions cache
        // TODO: remove when API is enhanced
        const totalTransactionsCacheJSON = localStorage.getItem(
            'totalTransactions'
        )
        let totalTransactionsCache = 0
        if (totalTransactionsCacheJSON) {
            const cache = JSON.parse(totalTransactionsCacheJSON)
            totalTransactionsCache = cache
        }
        this.totalTransactionsCache = totalTransactionsCache
    }

    saveCacheAvax() {
        const asset = this.avax
        if (asset) {
            const volume_day = asset.volume_day.toString()
            const txCount_day = asset.txCount_day
            const cache = {
                volume_day, // AVAX volume
                txCount_day, // AVAX count
            }
            localStorage.setItem('avaxCache', JSON.stringify(cache))
        }
    }

    saveCacheTotalTransactions() {
        const totalTransactions = this.totalTransactions
        localStorage.setItem(
            'totalTransactions',
            JSON.stringify(totalTransactions)
        )
    }

    // Data from Ortelius
    get tpmText(): string {
        const day = 60 * 24
        const avg = this.totalTransactions / day
        return avg > 1 ? avg.toFixed(0) : avg.toFixed(2)
    }

    get tpsText(): string {
        const day = 60 * 60 * 24
        const avg = this.totalTransactions / day
        return avg > 1 ? avg.toFixed(0) : avg.toFixed(2)
    }

    get assets() {
        return this.$store.state.assets
    }

    get avax(): Asset | undefined {
        return this.assets[AVAX_ID]
    }

    get avaxVolume(): string {
        if (!this.avax) {
            return parseInt(this.volumeCache.toFixed(0)).toLocaleString()
        }
        return this.avax.isHistoryUpdated
            ? parseInt(this.avax.volume_day.toFixed(0)).toLocaleString()
            : parseInt(this.volumeCache.toFixed(0)).toLocaleString()
    }

    get totalTransactions(): number {
        return this.$store.state.assetAggregatesLoaded
            ? this.$store.getters.totalTransactions
            : this.totalTransactionsCache
    }

    // Data from Avalanche-Go
    get totalStake(): string {
        return this.getTotalStake().div(Math.pow(10, 9)).toLocaleString(0)
    }

    get validatorCount(): number {
        return this.getTotalValidators()
    }

    get totalBlockchains(): number {
        return this.getTotalBlockchains()
    }

    get totalSubnets(): number {
        return Object.keys(this.$store.state.Platform.subnets).length
    }

    get percentStaked() {
        return this.getStakingRatio()
    }

    get annualStakingRewardPercentage(): string {
        const APR = this.$store.state.Platform.annualStakingRewardPercentage
        return `${APR.toFixed(1)}%`
    }
}
</script>
<style scoped lang="scss">
#network_statistics {
    color: $primary-color;
}

.header {
    padding-bottom: 30px;
}

.one-column {
    grid-template-columns: 1fr;
    row-gap: 30px;
    margin-bottom: 25px;
    padding-bottom: 15px !important;

    .meta {
        .meta_val {
            padding-top: 10px;
            font-size: 36px;

            .unit {
                font-size: 20px !important;
            }
        }
    }
}

.two-column {
    grid-template-columns: minmax(0, 0.75fr) minmax(0, 1fr);
    row-gap: 30px;
    column-gap: 30px;

    .meta {
        .meta_val {
            font-size: 20px;
        }
    }
}

dd {
    margin-inline-start: 0;
}

.stats {
    display: grid;
    padding: 4px 0 0;
    flex-wrap: wrap;
    overflow: auto;

    .meta {
        font-size: 12px;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        font-weight: 700;

        /* hyperlink */
        .stat {
            display: flex;
            flex-direction: column;

            &:hover {
                text-decoration: none !important;
                opacity: 0.7;
            }
        }

        .label {
            text-transform: capitalize;
            font-size: 12px;
            margin-bottom: 6px;
            padding-left: 3px;
        }

        .meta_val {
            font-weight: 500;
            line-height: 1em;

            .unit {
                font-size: 12px;
            }
        }
    }
}

@include smOrSmaller {
    .header {
        padding-bottom: 0;
    }

    .one-column,
    .two-column {
        row-gap: 0;
        column-gap: 30px;
        margin-bottom: 25px;
        padding-bottom: 15px !important;
    }

    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        .meta {
            font-weight: var(--f-weight);
            border-bottom: 1px solid var(--c-gray);
            padding-bottom: 0.75rem;

            .label {
                padding: 0;
                margin-bottom: 0;
                font-variation-settings: 'wght' 650;
                font-size: 15px;
                line-height: var(--f-height);
            }

            .meta_val {
                font-size: 15px;
                line-height: var(--f-height);

                .unit {
                    font-size: 15px !important;
                }
            }
        }
    }
}

@include xsOrSmaller {
    .stats {
        grid-template-columns: none;
    }
}
</style>
