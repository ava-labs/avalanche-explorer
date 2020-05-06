<template>
    <div class="token_row">
        <div class="data_col">
            <p class="symbol">{{token.symbol}}</p>
            <p class="name">{{token.name}}</p>
        </div>
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
                return stringToBig(this.token.currentSupply, this.token.denomination);
            }
        }
    }
</script>
<style scoped lang="scss">
    .token_row{



        > *{
            align-self: center;
        }

        > div{
            display: flex;
        }

        p{
            overflow: hidden;
            font-size: 13px;
            text-overflow: ellipsis;
        }
    }
    .symbol{
        /*color: #71C5FF;*/
        /*width: 40px;*/
        font-weight: bold;
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
        font-size: 16px !important;
        display: flex;
        flex-direction: column;
        span{
            font-size: 14px;
            opacity: 0.4;
        }
    }
</style>
