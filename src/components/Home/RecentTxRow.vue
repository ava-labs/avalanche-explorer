<template>
    <div class="recent_tx">
        <div class="avatar">
            <p>Tx</p>
        </div>
        <div class="info_col">
            <router-link :to="`/tx/${tx_id}`" class="id">{{tx_id.substring(0,12)}}...</router-link>
            <p class="time">35 seconds ago</p>
        </div>
        <div class="info_col">
            <div class="addr">
                <p>From</p>
                <router-link :to="`/address/${tx_id}`" class="id">
                    0x386927318...
                </router-link>
            </div>
            <div class="addr">
                <p>To</p>
                <router-link :to="`/address/${tx_id}`" class="id">
                    0x386345532...
                </router-link>
            </div>
        </div>
        <div>
            <p class="amount">0.0053 <span>AVA</span></p>
        </div>
<!--        <div v-if="tx_data" class="data">-->
<!--            <div>-->
<!--&lt;!&ndash;                <p class="label">Tx Id:</p>&ndash;&gt;-->
<!--                <router-link :to="`/tx/${tx_id}`">{{tx_id}}</router-link>-->

<!--&lt;!&ndash;                <p class="label">Network Id:</p>&ndash;&gt;-->
<!--&lt;!&ndash;                <p>{{tx_data.unsignedTx.networkID}}</p>&ndash;&gt;-->

<!--&lt;!&ndash;                <p class="label">Chain Id:</p>&ndash;&gt;-->
<!--&lt;!&ndash;                <p>{{tx_data.unsignedTx.blockchainID}}</p>&ndash;&gt;-->
<!--            </div>-->
<!--            <div class="inputs">-->
<!--                <p>Inputs</p>-->
<!--                <div v-for="(input, i) in tx_data.unsignedTx.inputs" :key="i">-->
<!--                    <p>Tx Id: {{input.txID}}</p>-->
<!--                    <p>Asset Id: {{input.assetID}}</p>-->
<!--                    <p>Amount: {{input.input.amount}}</p>-->
<!--                    {{inputAssets}}-->
<!--&lt;!&ndash;                    {{input}}&ndash;&gt;-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="outputs">-->
<!--                <p>Outputs</p>-->
<!--                <div v-for="(output, i) in tx_data.unsignedTx.outputs" :key="i">-->
<!--                    {{output.assetID}}-->
<!--                    {{output.output.addresses}}-->
<!--                    {{output.output.amount}}-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

    </div>
</template>
<script lang="ts">
    import api from "@/axios";
    import Vue from 'vue';
    import {ApiTransaction} from "@/js/types";

    export default Vue.extend({
        data(){
            return{
                tx_data: null as null|ApiTransaction
            }
        },
        props:{
            tx_id: String
        },
        created() {
            let parent = this;
            let url = `/x/transactions/${this.tx_id}`;
            api.get(url).then((res) => {
                const data = res.data;
                console.log(data);
                parent.tx_data = data;
            });
        },
        computed: {
            inputAssets(){
                let res: any = {};
                if(this.tx_data) {
                    let inputs = this.tx_data.unsignedTx.inputs;
                    for (let i=0; i< inputs.length; i++){
                        let input = inputs[i];
                        if(res[input.assetID]){
                            res[input.assetID] += input.input.amount;
                        }else{
                            res[input.assetID] = input.input.amount;
                        }
                    }
                }
                return res;
            }
        }
    })
</script>
<style scoped lang="scss">
    .recent_tx{
        padding: 6px 14px;
        position: relative;
        display: grid;
        grid-template-columns: 40px 1fr 1fr 40px;
        flex-direction: row;
        align-items: center;
    }
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

    .label{
        font-size: 12px;
        font-weight: bold;
        overflow: hidden;
    }
    .data{
        /*width: 100%;*/
        display: flex;
    }

    .info_col{
        padding: 0px 10px;
    }

    .id{
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .addr{
        display: flex;
        justify-content: end;
        p{
            width: 40px;
            text-align: right;
            margin-right: 10px;
        }
    }

    .amount{
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #C8C8C8;
        padding: 4px 12px;
        font-size: 11px;
        color: #646464;
        border-radius: 4px;
    }
</style>