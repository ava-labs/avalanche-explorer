<template>
    <div class="token_row">
        <p class="symbol">{{token.symbol}}</p>
        <p class="name">{{token.name}}</p>

        <router-link class="id" :to="`/tx/${token.id}`">{{token.id}}</router-link>

        <p class="chain">{{token.chainID}}</p>
        <p class="denomination">{{token.denomination}}</p>
        <p class="supply">{{supply}} <span>{{token.symbol}}</span></p>
    </div>
</template>
<script>
    import {stringToBig} from "../../helper";

    export default {
        props: {
            token: {
                type: Object,
                required: true
            }
        },
        computed: {
            supply(){
                return stringToBig(this.token.currentSupply, this.token.denomination).toFixed(this.token.denomination);
            }
        }
    }
</script>
<style scoped lang="scss">
    @use '../../main';

    .token_row{
        > *{
            align-self: center;
        }

        > div{
            display: flex;
        }

        p{
            overflow: hidden;
            font-size: 12px;
            text-overflow: ellipsis;
        }
    }
    .symbol{
        background-color: #EBE4FB;
        color: #976CFA;
        padding: 6px 12px;
        /*font-weight: bold;*/
        text-align: center;
        border-radius: 4px;
    }
    .name{
        opacity: 0.7;
    }
    .denomination{
        text-align: center;
    }

    .id{
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        text-decoration: none;
    }

    .data_col{
        display: flex;
        flex-direction: column;
    }

    .supply{
        text-align: right;
        span{
            display: inline-block;
            width: 40px;
            font-size: 14px;
            opacity: 0.4;
        }
    }


    @media only screen and (max-width: main.$mobile_width) {
        .symbol{
            padding: 2px;
        }
        .name{
            grid-column: 2/4;
        }

        .supply{
            grid-column: 1/4;
            text-align: right;
        }
    }
</style>
