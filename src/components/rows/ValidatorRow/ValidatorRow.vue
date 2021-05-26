<template>
    <div class="validator">
        <div class="rank">
            <div>
                <p>{{ validator.rank }}</p>
            </div>
        </div>
        <div class="id_col">
            <p>{{ validator.nodeID }}</p>
            <p>{{ duration }}</p>
        </div>
        <div class="stake_col">
            <p class="stakeAmount">{{ stakeAmountText }} AVAX</p>
            <p>{{ stakePercText }}%</p>
        </div>
        <div class="comm_col">
            <p>{{ cumulativePercText }}%</p>
            <CumulativeBar
                :total="totalStake"
                :amount="stakeAmount"
                :accumulated="cumulativeStake"
            />
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import { toAVAX } from '../../../helper'
import CumulativeBar from './CumulativeBar.vue'
import { IValidator } from '@/store/modules/platform/IValidator'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'

@Component({
    components: {
        CumulativeBar,
    },
})
export default class ValidatorRow extends Mixins(PlatformGettersMixin) {
    @Prop() validator!: IValidator
    @Prop() cumulativeStake!: number

    get totalStake() {
        const val = this.getTotalStake()
        return toAVAX(parseInt(val.toString()))
    }

    get stakeAmount() {
        return this.validator.stakeAmount
            ? toAVAX(this.validator.stakeAmount)
            : 0
    }

    get stakeAmountText() {
        return this.validator.stakeAmount
            ? toAVAX(this.validator.stakeAmount).toFixed(9)
            : ''
    }

    get stakePerc() {
        return (this.stakeAmount / this.totalStake) * 100
    }

    get stakePercText() {
        // redundant assignments bc referencing computed values affect performance
        const stakeAmount = toAVAX(this.validator.stakeAmount as number)
        const totalStake = toAVAX(parseInt(this.getTotalStake().toString()))
        return ((stakeAmount / totalStake) * 100).toFixed(8)
    }

    get cumulativePercText() {
        const cumulativeStake = toAVAX(this.cumulativeStake)
        const totalStake = toAVAX(parseInt(this.getTotalStake().toString()))
        return ((cumulativeStake / totalStake) * 100).toFixed(0)
    }

    get duration() {
        const endTime = this.validator.endTime.getTime()
        const startTime = this.validator.startTime.getTime()
        const dur = endTime - startTime
        return moment.duration(dur).humanize()
    }
}
</script>
<style scoped lang="scss">
.validator {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;

    > div {
        text-align: center;
        padding: 10px 15px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    p {
        text-align: left;
        text-overflow: ellipsis;
        font-size: 12px;
        overflow: hidden;
    }
}

.rank {
    > div {
        background-color: $white;
        color: $primary-color;
        border: 2px solid $primary-color;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        line-height: 40px;
    }

    p {
        width: 100%;
        text-align: center;
        font-weight: 900;
        color: $primary-color;
    }
}

.time {
    grid-column: 3/5;

    .display {
        height: 4px;
        position: relative;
        background-color: #dfdfdf;
        border-radius: 3px;
        overflow: hidden;
    }
}

.time_info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 6px;

    > div {
        flex-grow: 1;
    }
    > div:nth-of-type(2) p {
        text-align: center;
    }

    > div:nth-of-type(3) p {
        text-align: right;
    }

    .label {
        font-size: 10px;
    }
}

.label {
    opacity: 0.7;
    font-weight: lighter;
}

.id_col {
    overflow: hidden;
}

.commission_col {
    p {
        text-align: right;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 30px;

    > div {
        padding: 15px;
        text-align: center;
        line-height: 1.4em;
    }
}

.stake_col {
    p {
        text-align: right;
        padding: 2px 0;

        &:last-of-type {
            font-weight: 400;
        }
    }
}

.comm_col {
    position: relative;
    border-right: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;

    p {
        z-index: 2;
        text-align: right;
    }
}
@include smOnly {
    .validator {
        grid-template-columns: 70px 1fr 1fr 1fr 1fr;
        grid-template-rows: max-content max-content;
    }

    .time {
        grid-column: 1/3;
        grid-row: 2;
    }
}

@include xsOrSmaller {
    .validator {
        grid-template-columns: 42px 1fr 1fr 0.5fr;
        grid-template-rows: max-content max-content;

        > div {
            padding: 10px 15px 10px 0;
        }
    }

    .rank > div {
        color: $secondary-color;
        border: 2px solid $secondary-color;
        width: 24px;
        height: 24px;
        border-radius: 24px;
        line-height: 24px;

        > p {
            font-size: 10px;
        }
    }

    .time {
        grid-column: 1/3;
        grid-row: 2;
    }
}
</style>
