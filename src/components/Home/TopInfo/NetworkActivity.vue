<template>
    <div id="network_statistics" class="card">
        <div class="header">
            <h2 class="meta_title">
                Avalanche Network Activity
                <!-- <TooltipHeading content="Key Avalanche stats" :color="'#2196f3'"></TooltipHeading> -->
            </h2>
        </div>
        <section class="stats one-column">
            <!-- <article class="meta">
                <router-link class="stat" to="/tx">
                    <p class="label">
                        24h Transactions
                        <TooltipMeta
                            content="Total number of state queries or modifications of all blockchains on Avalanche in the past 24 hours"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="assetsLoaded">
                        <p class="meta_val">
                            {{totalTransactions.toLocaleString()}}
                            <span class="unit">{{tpmText}} TPM</span>
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
                    </div>
                </router-link>
            </article> -->
            <article class="meta">
                <router-link class="stat" to="/assets">
                    <p class="label">
                        24h Volume
                        <TooltipMeta
                            content="Total value of AVAX transferred on Avalanche in the past 24 hours"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="assetsLoaded">
                        <p class="meta_val">
                            {{ avaxVolume }}
                            <span class="unit">AVAX</span>
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
        </section>
        <section class="stats two-column">
            <article class="meta">
                <router-link class="stat" to="/validators">
                    <p class="label">
                        Validators
                        <TooltipMeta
                            content="Total number of nodes validating transactions on Avalanche"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">
                            {{ validatorCount.toLocaleString() }}
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/validators">
                    <p class="label">
                        Total Staked
                        <TooltipMeta
                            content="Total value of AVAX locked to secure Avalanche"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">
                            {{ totalStake }}
                            <span class="unit">AVAX</span>
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/blockchains">
                    <p class="label">
                        Blockchains
                        <TooltipMeta
                            content="Total number of blockchains on Avalanche"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">
                            {{ totalBlockchains }}
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/subnets">
                    <p class="label">
                        Subnets
                        <TooltipMeta
                            content="Total number of subnets on Avalanche"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">
                            {{ totalSubnets }}
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/subnets">
                    <p class="label">
                        Staking Ratio
                        <TooltipMeta
                            content="Percentage of AVAX locked to secure Avalanche out of total AVAX supply (360m)"
                            :color="'#2196f3'"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">{{ percentStaked }}%</p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
            <article class="meta">
                <router-link class="stat" to="/subnets">
                    <p class="label">Annual Staking Reward</p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">
                            {{ annualStakingRewardPercentage }}
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular
                            key="1"
                            :size="16"
                            :width="2"
                            color="#E84970"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </router-link>
            </article>
        </section>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { stringToBig, bigToDenomBig } from '@/helper'
import TooltipHeading from '../../misc/TooltipHeading.vue'
import TooltipMeta from '../TopInfo/TooltipMeta.vue'
import { AVAX_ID } from '@/store/index'
import { Asset } from '@/js/Asset'
import Big from 'big.js'
import { TOTAL_AVAX_SUPPLY } from '@/store/modules/platform/platform'
import { avalanche } from '@/avalanche'
import { Defaults, ONEAVAX } from 'avalanche/dist/utils'
import { BN } from 'avalanche/dist'

@Component({
    components: {
        TooltipHeading,
        TooltipMeta,
    },
})
export default class NetworkActivity extends Vue {
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
        let res = this.$store.getters['Platform/totalStake']
        res = stringToBig(res.toString(), 9).toFixed(0)
        return parseInt(res).toLocaleString()
    }

    get validatorCount(): number {
        return this.$store.getters['Platform/totalValidators']
    }

    get totalBlockchains(): number {
        return this.$store.getters['Platform/totalBlockchains']
    }

    get totalSubnets(): number {
        return Object.keys(this.$store.state.Platform.subnets).length
    }

    get percentStaked(): string {
        let totalStake = this.$store.getters['Platform/totalStake']
        totalStake = bigToDenomBig(totalStake, 9)
        const percentStaked = totalStake.div(TOTAL_AVAX_SUPPLY).times(100)
        return percentStaked.toFixed(2)
    }

    get annualStakingRewardPercentage(): string {
        const networkID = avalanche.getNetworkID()

        //@ts-ignore
        const defaultValues = Defaults.network[networkID]
        if (!defaultValues) {
            console.error('Network default values not found.')
            return 'TBD'
        }

        const maxConsumption: number = defaultValues.P.maxConsumption
        const minConsumption: number = defaultValues.P.minConsumption
        const avgReturn: number = ((maxConsumption + minConsumption) / 2) * 100

        return `${avgReturn.toFixed(0)}%`
    }

    get annualStakingReward(): BN {
        const totalStake: string = this.$store.getters[
            'Platform/totalStake'
        ].toFixed()
        const totalStake_BN: BN = new BN(totalStake)
        const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
        const TOTAL_AVAX_SUPPLY_BN = new BN(
            TOTAL_AVAX_SUPPLY.times(Math.pow(10, 9)).toFixed()
        )

        const annualStakingReward: BN = this.calculateStakingReward(
            totalStake_BN,
            ONE_YEAR_SECONDS,
            TOTAL_AVAX_SUPPLY_BN
        )
        return annualStakingReward
    }

    calculateStakingReward(
        amount: BN,
        duration: number,
        currentSupply: BN
    ): BN {
        const networkID = avalanche.getNetworkID()

        //@ts-ignore
        let defValues = Defaults.network[networkID]

        if (!defValues) {
            console.error('Network default values not found.')
            return new BN(0)
        }
        defValues = defValues.P

        const maxConsumption: number = defValues.maxConsumption
        const minConsumption: number = defValues.minConsumption
        const diffConsumption: number = maxConsumption - minConsumption
        const maxSupply: BN = defValues.maxSupply
        const maxStakingDuration: BN = defValues.maxStakingDuration
        const remainingSupply = maxSupply.sub(currentSupply)

        const amtBig = Big(amount.div(ONEAVAX).toString())
        const currentSupplyBig = Big(currentSupply.div(ONEAVAX).toString())
        const remainingSupplyBig = Big(remainingSupply.div(ONEAVAX).toString())
        const portionOfExistingSupplyBig = amtBig.div(currentSupplyBig)

        const portionOfStakingDuration: number =
            duration / maxStakingDuration.toNumber()
        const mintingRate: number =
            minConsumption + diffConsumption * portionOfStakingDuration

        let rewardBig: Big = remainingSupplyBig.times(
            portionOfExistingSupplyBig
        )
        rewardBig = rewardBig.times(Big(mintingRate * portionOfStakingDuration))

        const rewardStr = rewardBig.times(Math.pow(10, 9)).toFixed(0)
        const rewardBN = new BN(rewardStr)

        return rewardBN
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
    border-bottom: 1px solid $primary-color-xlight;

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

.stats {
    display: grid;
    padding: 4px 0 0;
    flex-wrap: wrap;
    overflow: auto;

    /* hyperlink */
    .meta {
        font-size: 12px;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        font-weight: 700;

        .stat {
            display: flex;
            flex-direction: column;

            &:hover {
                text-decoration: none !important;
                opacity: 0.7;
            }
        }

        .stat > div {
            display: flex;
        }

        p {
            padding: 2px 0;
            font-weight: 400;
        }

        .label {
            text-transform: capitalize;
            font-size: 12px;
            margin-bottom: 6px;
            padding-left: 3px;
        }

        .meta_val {
            font-weight: 300;
            line-height: 1em;

            .unit {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                opacity: 0.7;
            }
        }
    }
}

@include mdOnly {
    .stats {
        img {
            width: 24px;
        }
    }
}

@include smOnly {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        > div {
            padding: 30px 0 0;
        }
    }
}

@include xsOnly {
    .stats {
        grid-template-columns: none;

        .one-column {
            grid-template-columns: 1fr;
            row-gap: 45px;
            margin-bottom: 45px;

            .meta {
                .meta_val {
                    font-size: 20px;

                    .unit {
                        font-size: 14px !important;
                    }
                }
            }
        }

        .two-column {
            .meta {
                .meta_val {
                    font-size: 20px;
                }
            }
        }

        .stat {
            .label {
                font-size: 13px;
            }

            .meta_val {
                font-size: 20px;

                .unit {
                    font-size: 14px !important;
                }
            }
        }
    }
}
</style>
