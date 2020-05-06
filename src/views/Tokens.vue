<template>
    <div class="tokens">
        <h1>Tokens</h1>
        <div class="token_list">
            <div class="grid_headers token_row">
                <p>Symbol / Name</p>
                <p>ID</p>
                <p>Chain</p>
                <p class="denomination">Denomination</p>
                <p class="supply">Supply</p>
            </div>
            <token v-for="token in tokens" :key="token.id" class="token_row" :token="token"></token>
        </div>

    </div>
</template>
<script>
    import Token from '@/components/Tokens/Token';
    import axios from "@/axios";
    export default {
        components: {
            Token
        },
        data(){
            return {
            }
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

    }

    .token_list{
        background-color: #fff;
        padding: 30px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        border-radius: 6px;
    }

    .grid_headers{
        font-weight: bold;
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
    }

    .token_row{
        display: grid;
        grid-template-columns: 1fr 90px 90px 1fr 1fr;
        padding: 15px 15px;
        border-bottom: 1px solid #E7E7E7;
        column-gap: 10px;
    }

    .denomination{
        text-align: center;
    }


    .supply{
        text-align: right;
    }

</style>
