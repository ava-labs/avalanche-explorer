<template>
    <div>
        <div class="subsection">
            <div class="summary_label">Validator</div>
            <div>{{ tx.validatorNodeID }}</div>
        </div>
        <div class="subsection">
            <div class="summary_label">Duration</div>
            <div>
                <div>{{ duration }} days ({{ elapsed }}% elapsed)</div>
                <StakingTimeline
                    :start-time="tx.validatorStart"
                    :end-time="tx.validatorEnd"
                    :current-time="currentTime"
                />
            </div>
        </div>
        <div class="subsection">
            <div v-if="tx.rewarded">
                <div class="summary_label">Status</div>
                <!-- Rewarded -->
                <div v-if="rewardedDate">
                    <!-- Validator TX -->
                    <template v-if="isValidatorTx">
                        <p>
                            Validator is rewarded
                            <span class="status"
                                >{{
                                    validatorRewardUTXO.amount | toAVAX
                                }}
                                AVAX</span
                            >
                        </p>
                    </template>
                    <!-- Delegator TX -->
                    <template v-if="isDelegatorTx">
                        <p>
                            Delegator is rewarded
                            <span class="status"
                                >{{
                                    delegatorRewardUTXO.amount | toAVAX
                                }}
                                AVAX</span
                            >
                        </p>
                        <p class="margin_top">
                            Validator is rewarded
                            <span class="status"
                                >{{
                                    delegatorFeeUTXO.amount | toAVAX
                                }}
                                AVAX</span
                            >
                            as fee
                        </p>
                    </template>
                    <!-- Reward Time -->
                    <p class="margin_top">
                        {{ rewardedDate | fromNow }} ({{
                            rewardedDate.toLocaleString()
                        }})
                    </p>
                </div>
                <!-- Staking -->
                <div v-else>
                    <span class="status">Staking</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Transaction } from '@/js/Transaction'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import StakingTimeline from '@/components/Transaction/StakingTimeline.vue'
import moment from 'moment'
import { Output } from '@/store/modules/transactions/models'
import { toAVAX } from '@/helper'

@Component({
    components: {
        StakingTimeline,
    },
    filters: {
        toAVAX,
    },
})
export default class StakingSummary extends Vue {
    @Prop() tx!: Transaction

    currentTime: number = Math.round(new Date().getTime() / 1000)

    get rewardedDate() {
        return new Date(this.tx.validatorEnd * 1000)
    }

    get elapsed() {
        const numerator = this.currentTime - this.tx.validatorStart
        const denominator = this.tx.validatorEnd - this.tx.validatorStart
        const percent = Math.round((numerator / denominator) * 100)
        return percent > 100 ? 100 : percent
    }

    get duration() {
        const start = moment(this.tx.validatorStart * 1000)
        const end = moment(this.tx.validatorEnd * 1000)
        return Math.round(moment.duration(end.diff(start)).asDays())
    }

    get rewardUTXOs(): Output[] | undefined {
        // if rewarded:
        // Add Validator tx will have 1 rewardUtxo
        // Add Delegator tx will have 2 rewardUtxo for delegator reward and validator fee
        const rewards = this.tx.outputs.filter((tx) => tx.rewardUtxo === true)
        return rewards
            ? rewards.sort((a, b) => {
                  const aNum = parseInt(a.amount.toString())
                  const bNum = parseInt(b.amount.toString())
                  return bNum - aNum
              })
            : undefined
    }

    // VALIDATOR REWARDS
    get isValidatorTx() {
        return this.tx.type === 'add_validator'
    }

    get validatorRewardUTXO(): Output | undefined {
        // there is only one reward UTXO, this is the validator reward
        return this.rewardUTXOs
            ? this.rewardUTXOs.length === 1
                ? this.rewardUTXOs[0]
                : undefined
            : undefined
    }

    // DELEGATOR REWARDS
    get isDelegatorTx() {
        return this.tx.type === 'add_delegator'
    }

    get delegatorRewardUTXO(): Output | undefined {
        // more than one reward UTXO, the first is the delegator reward
        return this.rewardUTXOs
            ? this.rewardUTXOs.length > 1
                ? this.rewardUTXOs[0]
                : undefined
            : undefined
    }

    get delegatorFeeUTXO(): Output | undefined {
        // more than one reward UTXO, the second is the validator fee
        return this.rewardUTXOs
            ? this.rewardUTXOs.length > 1
                ? this.rewardUTXOs[1]
                : undefined
            : undefined
    }
}
</script>

<style scoped lang="scss">
.subsection {
    margin-bottom: 20px;
}
.inline_status {
    margin-top: 8px;
}
.margin_top {
    margin-top: 4px;
}
</style>
