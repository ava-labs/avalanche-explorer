<template>
    <transaction-result v-if="type===`transaction`" class="search_result" :item="item.data"></transaction-result>
    <address-result v-else-if="type===`address`" class="search_result" :item="item.data"></address-result>
    <asset-result v-else-if="type===`asset`" class="search_result" :item="item.data"></asset-result>
</template>
<script>
    import TransactionResult from "@/components/misc/SearchBar/TransactionResult";
    import AddressResult from './AddressResult';
    import AssetResult from "@/components/misc/SearchBar/AssetResult";
    import {Transaction} from "@/js/Transaction";

    export default {
        components: {
            TransactionResult,
            AddressResult,
            AssetResult
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
<style lang="scss">
    .search_result{
        padding: 8px 13px;
        background-color: #fff;
        display: flex;
        position: relative;

        $symbol_W: 40px;
        .symbol{
            /*padding: 10px 0;*/
            padding: 0;
            background-color: #F1F2F3;
            border-radius: 6px;
            font-weight: bold;
            font-size: 11px;
            height: $symbol_W;
            width: $symbol_W;
            text-align: center;
            line-height: $symbol_W;
        }

        .data{
            width: 100%;
            overflow: auto;
            padding: 4px 10px;
        }

        a{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        &:hover{
            background-color: #efefef;
        }
    }
</style>
<style scoped lang="scss">
</style>
