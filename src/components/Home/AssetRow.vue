<template>
    <div class="asset_row">
        <div class="avatar">
            <p>{{asset.symbol[0]}}</p>
        </div>
        <div class="rest">
            <div class="info_col">
                <p class="col_title">{{asset.symbol}}</p>
                <p class="col_val">{{asset.name}}</p>
            </div>
            <div class="info_col">
                <p class="col_title">Supply</p>
                <p class="col_val">{{supplyText}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            asset: Object,
        },
        computed: {
            supplyText(){
                // TODO: Switch to Big.js
                let asset = this.asset;
                let res = asset.currentSupply/(Math.pow(10,asset.denomination));
                return res.toLocaleString();
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
        background-color: #c4c4c4;

        p{
            width: 100%;
            font-weight: bold;
            color: #6b6b6b;
        }
    }
    .asset_row{
        padding: 8px 12px;
        display: flex;
        align-items: center;
        background-color: #f4f4f4;
        /*border: 1px solid #e2e2e2;*/
        border-radius: 2px;
    }


    .info_col:last-of-type{
        text-align: right;
        flex-grow: 1;
    }

    .col_title{
        /*font-weight: bold;*/
        font-size: 11px;
        opacity: 0.7;
    }

    .col_val{

    }

    .rest{
        flex-grow: 1;
        display: flex;
        margin-left: 10px;
    }
</style>