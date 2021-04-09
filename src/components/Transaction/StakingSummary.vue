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
                <div>
                    <p class="inline_status">
                        <template v-if="rewardedDate">
                            <span class="status">Rewarded</span>
                            <span v-if="rewardedDate">
                                {{ rewardedDate | fromNow }} ({{
                                    rewardedDate.toLocaleString()
                                }})
                            </span>
                        </template>
                        <template v-else>
                            <span class="status">Staking</span>
                        </template>
                    </p>
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

@Component({
    components: {
        StakingTimeline,
    },
})
export default class StakingSummary extends Vue {
    @Prop() tx!: Transaction

    currentTime: number = Math.round(new Date().getTime() / 1000)

    get rewardedDate() {
        return this.tx.rewardedTime ? new Date(this.tx.rewardedTime) : null
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
}
</script>

<style scoped lang="scss">
.subsection {
    margin-bottom: 20px;
}
.inline_status {
    margin-top: 8px;
}
</style>
