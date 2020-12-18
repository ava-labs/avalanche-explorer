<template>
    <div class="stats">
        <div class="header">
            <h3 class="meta_title">Staking Stats</h3>
            <p class="subtitle"></p>
        </div>
        <article class="meta">
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
        </article>
        <article class="meta">
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
        </article>
        <article class="meta">
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
        </article>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import TooltipMeta from '@/components/Home/TopInfo/TooltipMeta.vue'
import { stringToBig, bigToDenomBig } from '@/helper'
import Big from 'big.js'
import { TOTAL_AVAX_SUPPLY } from '@/store/modules/platform/platform'
import { avalanche } from '@/avalanche'
import { Defaults, ONEAVAX } from 'avalanche/dist/utils'
import { BN } from 'avalanche/dist'

@Component({
    components: {
        TooltipMeta,
    },
})
export default class ValidatorStats extends Vue {
    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded
    }

    // Data from Avalanche-Go
    get totalStake(): string {
        let res = this.$store.getters['Platform/totalStake']
        res = stringToBig(res.toString(), 9).toFixed(0)
        return parseInt(res).toLocaleString()
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
.header {
    padding-bottom: 30px;
}

h3 {
    margin: 0;
    font-weight: 400;
}

.subtitle {
    margin-top: 0.2em;
    font-size: 0.875rem;
}
.stats {
    display: flex;
    flex-direction: column;

    .meta {
        font-size: 12px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        font-weight: 700;
        padding-bottom: 24px;

        &:last-of-type {
            padding-bottom: 0;
        }

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
            font-weight: 700;
            margin-bottom: 6px;
            padding-left: 3px;
        }

        .meta_val {
            font-size: 36px;
            font-weight: 300;
            line-height: 1em;

            .unit {
                font-family: 'Rubik', sans-serif;
                font-size: 12px;
                opacity: 0.7;
            }
        }
    }
}
</style>
