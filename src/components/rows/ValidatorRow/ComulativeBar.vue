<template>
    <div class="comulative_bar">
        <div ref="agg_bar" class="agg_bar" :style="{
            width: `${barPerc}%`
        }">
            <div class="now_bar" :style="{
                width: `${nowPerc}%`
            }"></div>
        </div>
    </div>
</template>
<script>
    import Big from 'big.js'
    export default {
        props: {
            total: {
                type: Big,
                required: true,
            },
            accumulated:{
                type: Big,
                required: true,
            },
            amount: {
                type: Big,
                required: true,
            },
        },
        computed: {
            barPerc(){
                let perc = this.accumulated.div(this.total);
                return perc.times(100);
            },
            nowPerc(){
                let perc = this.amount.div(this.accumulated);
                return perc.times(100);
            }
        }
    }
</script>
<style scoped lang="scss">

    $color_bright: #CFEBFF;
    $color_dark: #A7D0F9;

    .comulative_bar{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .agg_bar{
        position: relative;
        width: 10px;
        height: 100%;
        background-color: $color_bright;


    }

    .now_bar{
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background-color: $color_dark;
    }
</style>
