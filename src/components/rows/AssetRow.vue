<template>
    <div :key="token.id" class="token_row">
        <div class="avatar">
            <p>{{token.symbol}}</p>
        </div>
        <p class="id">{{token.id}}</p>
        <div>
            <p class="symbol">{{token.symbol}}</p>
            <p class="name">{{token.name}}</p>
        </div>
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
    .avatar{
        width: 35px;
        height: 35px;
        border-radius: 35px;
        line-height: 35px;
        text-align: center;
        background-color: #F1F2F3;

        p{
            width: 100%;
            font-weight: bold;
            color: #272727;
        }
    }

    .token_row{
        display: grid;
        grid-template-columns: max-content 70px 1fr 90px 1fr 1fr;
        padding: 15px 15px;
        border-bottom: 1px solid #E7E7E7;


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
</style>
