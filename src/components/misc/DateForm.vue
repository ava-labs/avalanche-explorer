<template>
    <div class="dates_form">
        <div class="input_container">
            <label>Start</label>
            <datetime
                v-model="localStart"
                type="datetime"
                class="date hover_border"
                :min-datetime="startDateMin"
                :max-datetime="startDateMax"
            ></datetime>
        </div>
        <div class="input_container">
            <label>End</label>
            <datetime
                v-model="localEnd"
                type="datetime"
                class="date hover_border"
                :min-datetime="endDateMin"
                :max-datetime="endDateMax"
            ></datetime>
        </div>
    </div>
</template>
<script lang="ts">
import { DAY_MS, MINUTE_MS, GENESIS_TIME } from '@/constants'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

const MIN_STAKE_DURATION = DAY_MS * 14

@Component({})
export default class DateForm extends Vue {
    timeNow = 0
    localEnd = this.endDateMin
    localStart = this.startDateMin
    poller = 0
    now = new Date()

    @Prop() maxEndDate?: string

    @Watch('localEnd')
    endChange(val: string) {
        this.setEndDate(val)
        const endTime = new Date(val).getTime()
        const minDateTime = new Date(this.endDateMin).getTime()
        if (endTime < minDateTime) {
            this.localEnd = this.endDateMin
        }
    }

    @Watch('localStart')
    startChange(val: string) {
        this.setStartDate(val)
        if (this.now.getTime() < MIN_STAKE_DURATION) {
            this.localEnd = this.endDateMin
        }
    }

    created() {
        this.poller = window.setInterval(() => this.pollForUpdates(), 1000)
    }

    mounted() {
        // default end date is 3 weeks
        this.localEnd = this.now.toISOString()
        this.localStart = GENESIS_TIME
        this.setStartDate(this.localStart)
        this.setEndDate(this.localEnd)
    }

    destroyed() {
        this.killPollingInterval()
    }

    private killPollingInterval() {
        window.clearInterval(this.poller)
    }

    pollForUpdates(): void {
        this.now = new Date()
    }

    setStartDate(val: string) {
        this.$emit('change_start', val)
    }

    setEndDate(val: string) {
        this.$emit('change_end', val)
    }

    // now
    get endDateMax(): string {
        return this.now.toISOString()
    }

    // genesis + 1sec
    get endDateMin(): string {
        const min = new Date(GENESIS_TIME).getTime() + MINUTE_MS
        return new Date(min).toISOString()
    }

    // now - 1s
    get startDateMax(): string {
        const max = this.now.getTime() - MINUTE_MS
        return new Date(max).toISOString()
    }

    // genesis
    get startDateMin(): string {
        return new Date(GENESIS_TIME).toISOString()
    }
}
</script>
<style lang="scss">
.dates_form {
    .date input {
        border: none !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
        background-color: transparent;
        padding: 12px 13px 7px 0;
        color: #333;
        font-size: 16px;

        &:hover {
            border-bottom: 1px solid $purple !important;
            cursor: pointer;
        }
    }
}
</style>
<style scoped lang="scss">
.dates_form {
    display: flex;
    flex-direction: row;

    > div {
        width: 100%;
        margin-right: 15px;
        position: relative;
    }

    label {
        left: 0px;
        right: auto;
        position: absolute;
        color: rgba(0, 0, 0, 0.6);
        height: 20px;
        line-height: 20px;
        transform: translateY(-8px);
    }
}

.reverse {
    flex-direction: row-reverse !important;
}

@include smOrSmaller {
    .dates_form {
        flex-direction: column !important;
        align-items: left;

        > p {
            flex-grow: 1;
        }
    }
}
</style>
