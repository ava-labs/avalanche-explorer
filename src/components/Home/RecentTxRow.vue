<template>
    <div>
        <div v-if="tx_data" class="data">
            <div>
<!--                <p class="label">Tx Id:</p>-->
                <router-link :to="`/tx/${tx_id}`">{{tx_id}}</router-link>

<!--                <p class="label">Network Id:</p>-->
<!--                <p>{{tx_data.unsignedTx.networkID}}</p>-->

<!--                <p class="label">Chain Id:</p>-->
<!--                <p>{{tx_data.unsignedTx.blockchainID}}</p>-->
            </div>
            <div class="inputs">
                <p>Inputs</p>
                <div v-for="(input, i) in tx_data.unsignedTx.inputs" :key="i">
                    <p>Tx Id: {{input.txID}}</p>
                    <p>Asset Id: {{input.assetID}}</p>
                    <p>Amount: {{input.input.amount}}</p>
                    {{inputAssets}}
<!--                    {{input}}-->
                </div>
            </div>
            <div class="outputs">
                <p>Outputs</p>
                <div v-for="(output, i) in tx_data.unsignedTx.outputs" :key="i">
                    {{output.assetID}}
                    {{output.output.addresses}}
                    {{output.output.amount}}
                </div>
            </div>
        </div>

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
            let url = `/transactions/${this.tx_id}`;
            api.get(url).then((res) => {
                const data = res.data;
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
<style scoped>
    .label{
        font-size: 12px;
        font-weight: bold;
        overflow: hidden;
    }
    .data{
        width: 100%;
        display: flex;
    }
</style>