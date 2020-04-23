<template>
    <div :key="token.id" class="token_row">
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
    .token_row{
        display: grid;
        grid-template-columns: 70px 1fr 90px 1fr 1fr;
        padding: 15px 15px;
        border-bottom: 1px solid #E7E7E7;


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