<template>
    <div class="search_result" @click="select">
        <p class="symbol">#</p>
        <div class="data">
            <p class="id">{{chainNow}}-{{item.address}}</p>
            <p class="balance">Balance <span>{{balance.toFixed(2)}} AVA</span></p>
        </div>
    </div>
</template>
<script>
    import {stringToBig} from "@/helper";

    export default {
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        methods: {
            select(){
                let url = `/address/${this.item.address}`;
                this.$router.push(url);
                this.$emit('select');
            }
        },
        computed: {
            balance(){
                let res = stringToBig(this.item.balance, 9)
                return res;
            },
            numTx(){
                return this.item.transactionCount;
            },
            chainNow(){
                return this.$store.state.chainId;
            }
        }
    }
</script>
<style scoped lang="scss">
@use '../../../main';
    .id{
        color: main.$primary-color;
    }

    .balance{
        span{
            background-color: #E6F5FF;
            padding: 3px 6px;
            color: main.$primary-color;
            border-radius: 3px;
        }
    }
    
    $symbol_W: 40px;

    .symbol {
        padding: 0;
        background-color: #f1f2f3;
        border-radius: 6px;
        font-weight: bold;
        font-size: 11px;
        height: $symbol_W;
        width: $symbol_W;
        text-align: center;
        line-height: $symbol_W;
    }
</style>
