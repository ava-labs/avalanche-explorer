<template>
    <div class="cumulative_bar">
        <div ref="agg_bar" class="agg_bar" :style="{width: `${barPerc}%`}">
            <div class="now_bar" :style="{width: `${nowPerc}%`}"></div>
        </div>
    </div>
</template>
<script>
import { toAVA } from "../../../helper";

export default {
    props: {
        total: {
            type: Number,
            required: true
        },
        accumulated: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
    computed: {
        barPerc() {
            return toAVA(this.accumulated) / this.total * 100;
        },
        nowPerc() {
            return toAVA(this.amount) / toAVA(this.accumulated) * 100;
        }
    }
};
</script>
<style scoped lang="scss">
$color_bright: #cfebff;
$color_dark: #a7d0f9;

.cumulative_bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.agg_bar {
    position: relative;
    width: 10px;
    height: 100%;
    background-color: $color_bright;
}

.now_bar {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background-color: $color_dark;
}
</style>
