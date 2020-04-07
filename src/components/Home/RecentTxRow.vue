<template>
    <div>
        <div v-if="tx_data" class="data">
            <div>

                <p>
                    Tx Id:
                    <router-link :to="`/tx/${tx_id}`">{{tx_id}}</router-link>
                </p>
                <p>Network Id: {{tx_data.unsignedTx.networkID}}</p>
                <p>Chain Id: {{tx_data.unsignedTx.blockchainID}}</p>
            </div>
            <div class="inputs">
                <p>Inputs</p>
                <div v-for="input in tx_data.unsignedTx.inputs" :key="input.txID">
                    <p>Tx Id: {{input.txID}}</p>
                    <p>Asset Id: {{input.assetID}}</p>
                    <p>Amount: {{input.input.amount}}</p>
<!--                    {{input}}-->
                </div>
            </div>
            <div class="outputs">
                <p>Outputs</p>
                {{tx_data.unsignedTx.outputs}}
            </div>
        </div>

    </div>
</template>
<script>
    import api from "@/axios";

    export default {
        data(){
            return{
                tx_data: null,
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
        }
    }
</script>
<style scoped>
    .data{
        width: 100%;
        display: flex;
    }
</style>