<template>
    <transaction-result v-if="type===`transaction`" class="search_result" :item="item.data"></transaction-result>
    <div v-else-if="type===`address`" class="search_result">
        {{type}}
        <p class="symbol">Tx</p>
    </div>
</template>
<script>
    import TransactionResult from "@/components/misc/SearchBar/TransactionResult";
    import {Transaction} from "@/js/Transaction";

    export default {
        components: {
            TransactionResult
        },
        data(){
            return{
                tx: null,
            }
        },
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        computed: {
            type(){
                return this.item.type;
            }
        },
        created() {
            if(this.type === 'transaction'){
                let tx = new Transaction(this.item.data);
                this.tx = tx;
            }
        }
    }
</script>
<style scoped lang="scss">
    .search_result{
        padding: 8px 13px;
        background-color: #fff;
        display: grid;
        grid-template-columns: max-content 1fr;
        position: relative;


        a{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }


        &:hover{
            background-color: #f0f0f0;
        }
    }

    .symbol{
        padding: 10px;
        background-color: #F1F2F3;
        border-radius: 6px;
        font-weight: bold;
    }
</style>