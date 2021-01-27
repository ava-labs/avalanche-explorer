<template>
    <div class="time_display">
        <div
            class="fill"
            :style="{
                width: `${filledPerc * 100}%`,
                backgroundColor: colorFill,
            }"
        ></div>
    </div>
</template>
<script>
export default {
    props: {
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        colorFill: {
            type: String,
            default: '#ddd',
        },
    },
    computed: {
        filledPerc() {
            const now = new Date()
            const total = this.end - this.start

            const perc = (now - this.start) / total
            return perc
        },
    },
}
</script>
<style scoped lang="scss">
.time_display {
    font-size: 9px;
}

.fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
}
</style>
