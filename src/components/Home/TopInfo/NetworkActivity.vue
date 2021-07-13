<template>
    <div id="network_statistics" class="card">
        <div class="header">
            <h2 class="top_info_heading">Avalanche Network Activity</h2>
        </div>
        <section class="stats one-column">
            <!-- <dl>
                <router-link class="link" to="/tx">
                    <dd class="indent">
                        24h Transactions
                        <TooltipMeta
                            content="Total number of state queries or modifications of all blockchains on Avalanche in the past 24 hours"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded">
                            {{totalTransactions.toLocaleString()}}
                            <span class="unit">{{tpmText}} TPM</span>
                        </template>
                        <v-progress-circular v-else :size="16" :width="2" color="#E84970" indeterminate key="1"/>                        
                    </dt>                    
                </router-link>
            </dl> -->
            <dl>
                <router-link class="link" to="/assets">
                    <dd class="indent">
                        24h Volume
                        <TooltipMeta
                            content="Total value of AVAX transferred on Avalanche in the past 24 hours"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded">
                            {{ avaxVolume }}
                            <span class="unit">AVAX</span>
                        </template>
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
        </section>
        <section class="stats two-column">
            <dl>
                <router-link class="link" to="/validators">
                    <dd>
                        Validators
                        <TooltipMeta
                            content="Total number of nodes validating transactions on Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded">
                            {{ validatorCount.toLocaleString() }}
                        </template>
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
            <dl>
                <router-link class="link" to="/validators">
                    <dd>
                        Total Staked
                        <TooltipMeta
                            content="Total value of AVAX locked to secure Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded">
                            {{ totalStake }}
                            <span class="unit">AVAX</span></template
                        >
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
            <dl>
                <router-link class="link" to="/blockchains">
                    <dd>
                        Blockchains
                        <TooltipMeta
                            content="Total number of blockchains on Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded">{{
                            totalBlockchains
                        }}</template>
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
            <dl>
                <router-link class="link" to="/subnets">
                    <dd>
                        Subnets
                        <TooltipMeta
                            content="Total number of subnets on Avalanche"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded">{{
                            totalSubnets
                        }}</template>
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
            <dl>
                <router-link class="link" to="/subnets">
                    <dd>
                        Staking Ratio
                        <TooltipMeta
                            content="Percentage of AVAX locked to secure Avalanche out of total AVAX supply"
                            :color="'#2196f3'"
                        />
                    </dd>
                    <dt>
                        <template v-if="subnetsLoaded"
                            >{{ percentStaked }}%</template
                        >
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
            <dl>
                <router-link class="link" to="/subnets">
                    <dd>Annual Staking Reward</dd>
                    <dt>
                        <template v-if="subnetsLoaded">{{
                            annualStakingRewardPercentage
                        }}</template>
                        <v-progress-circular
                            v-else
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        />
                    </dt>
                </router-link>
            </dl>
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
    row-gap: 24px;
    margin-bottom: 24px;

    dl {
        dt {
            font-size: 36px;

            .unit {
                font-size: 20px !important;
            }
        }
    }
}

.two-column {
    grid-template-columns: minmax(0, 0.75fr) minmax(0, 1fr);
    row-gap: 24px;
    column-gap: 24px;

    dl {
        dt {
            font-size: 20px;
        }
    }
}

.stats {
    display: grid;
    flex-wrap: wrap;

    dl {
        .link {
            &:hover {
                text-decoration: none !important;
                opacity: 0.7;
            }
        }
    }
}

@include smOrSmaller {
    .header {
        padding-bottom: 24px;
    }

    .one-column {
        margin-bottom: 0;
    }

    .one-column,
    .two-column {
        row-gap: 0;
        column-gap: 0;

        dl {
            dd {
                font-size: var(--f-size);
            }

            dt {
                font-size: var(--f-size);
                .unit {
                    font-size: 15px !important;
                }
            }
        }
    }

    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;
    }
}

@include xsOrSmaller {
    .stats {
        grid-template-columns: none;
    }
}
</style>
