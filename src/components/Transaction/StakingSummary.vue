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
                ></StakingTimeline>
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

@Component({})
export default class StakingSummary extends Vue {
    @Prop() tx!: Transaction
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
