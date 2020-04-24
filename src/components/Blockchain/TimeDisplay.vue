<template>
    <div class="time_display">
        <div class="fill" :style="{
            width: `${filledPerc*100}%`,
            backgroundColor: color_fill
        }"></div>
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
            color_fill:{
                type: String,
                default: "#ddd"
            }
        },
        computed:{
            filledPerc(){
                let now = new Date();
                let total = this.end - this.start;

                let perc = (now-this.start)/total;
                return perc;
            }
        }
    }
</script>
<style scoped lang="scss">
    .time_display{
        font-size: 9px;
    }

    .fill{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
    }
</style>
