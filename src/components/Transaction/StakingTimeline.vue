<template>
    <div class="diagram-container">
        <div class="diagram">
            <div
                class="chartbar"
                :style="{
                    left: `${start}px`,
                    width: `${stakingDuration}px`,
                    backgroundColor: darkColor,
                }"
            ></div>
            <div
                class="chartbar_complete"
                :style="{
                    left: `${start}px`,
                    width: `${elapsedDuration}px`,
                    backgroundColor: color,
                }"
            ></div>
            <div
                class="now"
                :style="{ left: `${current}px`, backgroundColor: color }"
            ></div>
        </div>
        <div class="labels">
            <div>
                <div
                    class="diagram_label"
                    :style="{
                        color: color,
                    }"
                >
                    Start
                </div>
                <div
                    class="diagram_label"
                    :style="{
                        color: color,
                    }"
                >
                    {{ (startTime * 1000) | date }}
                </div>
            </div>
            <div class="right">
                <div
                    class="diagram_label"
                    :style="{
                        color: color,
                    }"
                >
                    End
                </div>
                <div
                    class="diagram_label"
                    :style="{
                        color: color,
                    }"
                >
                    {{ (endTime * 1000) | date }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { scaleLinear } from 'd3-scale'
import { P } from '@/known_blockchains'

@Component({})
export default class StakingTimeline extends Vue {
    @Prop() startTime!: number
    @Prop() endTime!: number
    @Prop() currentTime!: number

    diagramWidth = 250

    get start() {
        return this.scale(this.startTime)
    }

    get current() {
        return this.currentTime > this.endTime
            ? this.scale(this.endTime)
            : this.scale(this.currentTime)
    }

    get stakingDuration() {
        return this.scale(this.endTime) - this.scale(this.startTime)
    }

    get elapsedDuration() {
        const elapsed =
            this.scale(this.currentTime) - this.scale(this.startTime)
        return this.currentTime > this.endTime ? this.stakingDuration : elapsed
    }

    get darkColor() {
        return P.darkColor
    }

    get color() {
        return P.color
    }

    scale(val: number) {
        const scale = scaleLinear()
            .domain([this.startTime, this.endTime])
            .range([0, this.diagramWidth])
        return scale(val)
    }
}
</script>

<style scoped lang="scss">
.diagram {
    margin-top: 5px;
    margin-bottom: 5px;
    width: 100%;
    height: 20px;
    position: relative;
}

.chartbar {
    position: absolute;
    top: 0;
    height: 100%;
}

.chartbar_complete {
    position: absolute;
    top: 0;
    height: 100%;
    opacity: 0.5;
}

.text-right {
    text-align: right !important;
}

.diagram-container {
    width: 250px;
}

.duration_text_container {
    margin-top: -20px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%;
}

.now {
    position: absolute;
    top: 0;
    font-size: 12px;
    background-color: trans;
    height: 100%;
    width: 1px;
    z-index: 5;
}

.percentage_text {
    position: absolute;
    text-align: right;
    top: 0;
    width: 50px;
    color: $primary-color;
    font-size: 12px;
    z-index: 3;
}

.date {
    color: $gray;
    padding-top: 21px;
    line-height: 1em !important;
}

.time {
    color: $gray;
    font-size: 10px;
}

.labels {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > .right {
        text-align: right;
    }
}

.diagram_label {
    font-size: 10px;
    line-height: 1.25em;
}
</style>
