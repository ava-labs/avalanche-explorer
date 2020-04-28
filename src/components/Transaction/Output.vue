<template>
    <div>
        <div class="data_row">
            <div class="to">
                <b>To</b>
                <router-link v-for="(addr, i) in output.output.addresses"
                             :to="`/address/${addr}`"
                             :key="i">
                    {{addr}}
                </router-link>
            </div>
            <div class="amount_symbol">
                <p>{{amount}} {{asset.name}}</p>
            </div>
        </div>

        <div class="data_row minidata">
            <div style="flex-grow: 1">
                <p class="label">Asset</p>
                <p>{{asset.name}}</p>
            </div>
            <div style="flex-grow: 1">
                <p class="label">Lock Time</p>
                <p>{{output.output.locktime}}</p>
            </div>
            <div style="flex-grow: 1">
                <p class="label">Threshold</p>
                <p>{{output.output.threshold}}</p>
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
                let res = Big(this.output.output.amount).div(Math.pow(10,asset.denomination));
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
        color: #71C5FF;
        padding: 8px 30px;
        border-radius: 2px;
        white-space: nowrap;
    }

    .data_row{
        align-items: center;
        display: flex;
    }

    .label{
        font-weight: bold;
    }

    .to{
        flex-grow: 1;
        font-family: Helvetica, monospace;
    }



    .minidata{
        padding: 5px 0px;
        div{
            text-align: left;
        }
    }
    .minidata div{
    }
</style>
