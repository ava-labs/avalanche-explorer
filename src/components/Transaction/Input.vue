<template>
    <div class="io_item">
<!--        <div class="data_row">-->
<!--            <p class="label" style="flex-grow: 1;">Tx Id</p>-->
<!--            <router-link :to="`/tx/${input.output.id}`">{{input.output.id}}</router-link>-->
<!--        </div>-->
<!--        <div class="data_row">-->
<!--            <p class="label" style="flex-grow: 1;">Token</p>-->
<!--            <router-link :to="`/tx/${asset}`">{{asset.name}}</router-link>-->
<!--        </div>-->

        <div class="data_row">
            <div>
                <p class="label">Tx</p>
                <p class="tx_id"><router-link :to="txLink">{{input.output.transactionID}}</router-link></p>
            </div>
            <div>
                <p class="label">From</p>
                <p class="address" v-for="addr in addresses" :key="addr">{{addr}}</p>
            </div>
            <div>
                <p class="label">Amount</p>
                <p class="amount">{{amount}} {{asset.name}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import Big from 'big.js';
    export default {
        props: {
            input: {
                type: Object,
                required: true,
            }
        },
        computed:{
            addresses(){
                return this.input.output.addresses;
            },
            amount(){
                let asset = this.asset;
                let res = Big(this.input.output.amount).div(Math.pow(10,asset.denomination));
                return res.toFixed(asset.denomination);
            },
            asset(){
                let assets = this.$store.state.assets;
                let assetId = this.input.output.assetID;
                let res = assets[assetId];
                return res;
            },
            txLink(){
                return `/tx/${this.input.output.transactionID}`
            }
        }
    }
</script>
<style scoped lang="scss">
    .label{
        font-weight: bold;
        white-space: nowrap;
    }

    .data_row{
        display: grid;
        grid-template-columns: 1fr  1fr max-content;

        p {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .minidata > div{
        flex-grow: 1;
    }

    .tx_id{
        margin: 4px 0px;
        padding-right: 10px;
    }

    .address{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 4px 0px;
        padding-right: 10px;
    }


    .amount{
        background-color: #E6F5FF;
        color: #71C5FF;
        width: max-content;
        padding: 8px 30px;
        border-radius: 4px;
    }
</style>
