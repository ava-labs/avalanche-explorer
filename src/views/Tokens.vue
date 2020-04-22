<template>
    <div class="tokens">
        <h1>Tokens</h1>

        <div class="grid_headers token_row">
            <p>Symbol / Name</p>
            <p>Chain</p>
            <p class="denomination">Denomination</p>
            <p>Supply</p>
        </div>
        <div v-for="token in tokens" :key="token.id" class="token_row">
            <div>
                <p class="symbol">{{token.symbol}}</p>
                <p class="name">{{token.name}}</p>
            </div>
            <p class="chain">{{token.chainID}}</p>
            <p class="denomination">{{token.denomination}}</p>
            <p class="supply">{{token.currentSupply}}</p>
        </div>
    </div>
</template>
<script>
    import axios from "@/axios";
    export default {
        data(){
            return {
            }
        },
        created() {
            let parent = this;
            // axios.get('/x/assets').then(res => {
            //     parent.tokens = res.data;
            //     console.log(res);
            // });
        },
        computed: {
            tokens(){
                return this.$store.state.assets;
            }
        }
    }
</script>
<style scoped lang="scss">
    h1{
        /*font-size: 12px;*/
        padding-left: 15px;
    }

    .tokens{
        margin: 30px 18vw;
        background-color: #fff;
        padding: 30px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        border-radius: 6px;
    }


    .grid_headers{
        font-weight: bold;
    }

    .token_row{
        display: grid;
        grid-template-columns: 1fr 90px 1fr 1fr;
        padding: 15px 15px;
        border-bottom: 1px solid #E7E7E7;


        > div{
            display: flex;




        }

        p{
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }


    .symbol{
        color: #71C5FF;
        width: 40px;
        text-align: right;
    }
    .name{
        padding-left: 8px;
    }
    .denomination{
        text-align: center;
    }
</style>
