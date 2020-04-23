<template>
    <address-row v-if="type==='address'" :address="result"></address-row>
    <tx-row v-else-if="type==='transaction'" :transaction="result.Data"></tx-row>
    <asset-row v-else :token="result.Data"></asset-row>
</template>
<script>
    import TxRow from "../rows/TxRow";
    import AssetRow from "../rows/AssetRow";
    import AddressRow from "../rows/AddressRow";

    export default {
        components: {
            AddressRow,
            TxRow,
            AssetRow
        },
        props: {
            query: {
                type: String,
                required: true,
            },
            result: {
                type: Object,
                required: true
            }
        },
        computed: {
            rowType(){
                switch (this.type) {
                    case 'address':
                        return AddressRow
                }
                return null;
            },
            type(){
                return this.result.type;
            },
            typeSymbol(){
                if(this.type==='address'){
                    return '#';
                }
                return 'Tx'
            },
            txCount(){
                return this.result.Data.transactionCount;
            },
            balance(){
                return this.result.Data.balance;

            },
            lifetimeValue(){
                return this.result.Data.lifetimeValue;
            },
            url(){
                if(this.type === 'address'){
                    return `/address/${this.query}`;
                }
                return '/';
            },
            tx_id(){
                return this.result.Data.id;
            },
            tx_timestamp(){
                let stamp = this.result.Data.timestamp;
                return stamp;
            }
        }
    }
</script>
<style scoped lang="scss">
    .result_row{
        /*display: flex;*/
        /*align-items: center;*/
    }
    $symbol_w: 35px;
    .symbol{
        text-align: center;
        line-height: $symbol_w;
        background-color: #F1F2F3;
        color: #000;
        font-size: 14px;
        font-weight: bold;
        box-sizing: border-box;
        height: $symbol_w;
        width: $symbol_w;
        border-radius: $symbol_w;
    }

    .link{
        text-decoration: none;
        text-transform: capitalize;
    }


    .center_info{
        display: flex;
        flex-grow: 1;

        >div{
            /*flex-grow: 1;*/
            text-align: center;
            padding-left: 30px;
        }

        .label{
            font-size: 12px;
            opacity: 0.7;
            font-weight: lighter;
            margin-bottom: 6px;
        }
    }
</style>