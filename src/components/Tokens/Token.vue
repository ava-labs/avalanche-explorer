<template>
    <div class="token_row">
        <div class="data_col">
            <p class="symbol">{{token.symbol}}</p>
            <p class="name">{{token.name}}</p>
        </div>
        <router-link class="id" :to="`/tx/${token.id}`">{{token.id}}</router-link>

        <p class="chain">{{token.chainID}}</p>
        <p class="denomination">{{token.denomination}}</p>
        <p class="supply">{{token.currentSupply}}</p>
    </div>
</template>
<script>
    export default {
        props: {
            token: {
                type: Object,
                required: true
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
</style>
