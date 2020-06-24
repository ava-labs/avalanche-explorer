<template>
    <div class="io_item">
<!--        <div class="data_row">-->
<!--            <p class="label" style="flex-grow: 1;">Tx Id</p>-->
<!--            <router-link :to="`/tx/${input.output.id}`">{{input.output.id}}</router-link>-->
<!--        </div>-->
<!--        <div class="data_row">-->
<!--            <p class="label" style="flex-grow: 1;">Asset</p>-->
<!--            <router-link :to="`/tx/${asset}`">{{asset.name}}</router-link>-->
<!--        </div>-->

        <div class="data_row top_data">
            <div class="from">
                <b>From</b><router-link class="address"
                             v-for="addr in addresses"
                             :to="`/address/${addr}`"
                             :key="addr">{{addr}}</router-link>
            </div>
            <div>
                <p class="amount">{{amount}} <b>{{asset.symbol}}</b></p>
            </div>
        </div>
        <div class="data_row minidata">
            <div>
                <p class="label">Root Tx</p>
                <p class="tx_id"><router-link :to="txLink">{{input.output.transactionID}}</router-link></p>
            </div>
            <div>
                <p class="label">Timestamp</p>
                <p>{{timestamp}}</p>
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
            },
            timestamp(){
                return this.input.output.timestamp;
            }
        }
    }
</script>
<style scoped lang="scss">
    .label{
        font-weight: 400; /* 700 */
        white-space: nowrap;
    }

    .minidata{
        display: grid;
        grid-template-columns: 1fr  1fr max-content;

        p {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .data_row{
        align-items: center;
        display: flex;
    }

    .top_data{
        display: grid;
        grid-template-columns: minmax(0,1fr) max-content;
    }

    .from{
        white-space: nowrap;
        display: flex;
        align-items: center;
        font-family: Helvetica, monospace;
        a{
            margin-left: 10px;
        }
    }
    .minidata > div{
        flex-grow: 1;
        margin-right: 4em;
    }

    .tx_id{
        margin: 4px 0px;
        padding-right: 10px;
        white-space: nowrap;
        max-width: 130px;
    }
    .label{
        font-weight: lighter;
        opacity: 0.7;
    }
    .address{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 4px 0px;
        padding-right: 10px;
    }


    .amount{
        background-color: main.$primary-color-light;
        color: main.$primary-color;
        width: max-content;
        padding: 4px 8px;
        border-radius: 3px;
    }
</style>
