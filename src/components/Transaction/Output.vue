<template>
    <div>
        <div class="data_row top_data">
            <div class="to">
                <b>To</b>
                <router-link v-for="(addr, i) in output.addresses"
                             :to="`/address/${addr}`"
                             :key="i">
                    {{addr}}
                </router-link>
            </div>
            <div class="amount_symbol">
                <p>{{amount}} <b>{{asset.symbol}}</b></p>
            </div>
        </div>

        <div class="data_row minidata">
            <div>
                <p class="label">Asset</p>
                <p>{{asset.name}}</p>
            </div>
            <div>
                <p class="label">Lock Time</p>
                <p>{{output.locktime}}</p>
            </div>
            <div>
                <p class="label">Threshold</p>
                <p>{{output.threshold}}</p>
            </div>
            <div>
                <p class="label">Type</p>
                <p>{{output.outputType}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import Big from "big.js";

    export default {
        props: {
            output: {
                type: Object,
                required: true,
            }
        },
        computed:{
            amount(){
                let asset = this.asset;
                let res = Big(this.output.amount).div(Math.pow(10,asset.denomination));
                return res.toFixed(asset.denomination);
            },
            asset(){
                let assets = this.$store.state.assets;
                let id = this.output.assetID;

                let res = assets[id];
                return res;
            }
        }
    }
</script>
<style scoped lang="scss">
    .amount_symbol{
        background-color: #E6F5FF;
        color: main.$primary-color;
        padding: 4px 8px;
        border-radius: 3px;
        white-space: nowrap;
    }

    .data_row{
        align-items: center;
        display: flex;
    }

    .label{
        font-weight: lighter;
        opacity: 0.7;
    }

    .to{
        flex-grow: 1;
        font-family: Helvetica, monospace;
        white-space: nowrap;
        display: flex;

        a{
            /*max-width: 50px;*/
            margin-left: 10px;
        }
    }

    .top_data{
        display: grid;
        grid-template-columns: minmax(0,1fr) max-content;
    }


    .minidata{
        padding: 5px 0px;

        > div{
            margin-right: 4em;
            text-align: left;
        }
    }
    .minidata div{
    }
</style>
