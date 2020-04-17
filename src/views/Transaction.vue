<template>
    <div class="transaction_details">
        <h1>Transaction Details</h1>
        <div v-if="tx_data">
            <div>
                <p class="id">{{txId}}</p>
                <div class="main_info">
                    <div>
                        <p class="label">Network</p>
                        <p>{{tx_data.unsignedTx.networkID}}</p>
                    </div>
                    <div>
                        <p class="label">Blockchain</p>
                        <p>{{tx_data.unsignedTx.blockchainID}}</p>
                    </div>
                </div>
            </div>
            <div class="io">
                <div class="inputs">
                    <h4>Inputs</h4>
                    <div class="io_item" v-for="input in tx_data.unsignedTx.inputs" :key="input.txID">
                        <p class="label">Tx Id</p>
                        <p>
                            <router-link :to="`/tx/${input.txID}`">{{input.txID}}</router-link>
                        </p>

                        <p class="label">Asset</p>
                        <p>{{input.assetID}}</p>

                        <p class="label">Amount</p>
                        <p>{{input.input.amount}}</p>
                    </div>
                </div>
                <div class="outputs">
                    <h4>Outputs</h4>
                    <div class="io_item" v-for="(output, i) in tx_data.unsignedTx.outputs"
                         :key="i">
                        <div style="display: flex;">
                            <div>
                                <p class="label">Asset</p>
                                <p>{{output.assetID}}</p>
                            </div>
                            <div style="text-align: right; flex-grow: 1">
                                <p class="label">Amount</p>
                                <p>{{output.output.amount}}</p>
                            </div>
                        </div>

                        <div style="display: flex">
                            <div>
                                <p class="label">Lock Time: </p>
                                <p>{{output.output.locktime}}</p>
                            </div>
                            <div>
                                <p class="label">Threshold</p>
                                <p>{{output.output.threshold}}</p>
                            </div>
                        </div>

                        <p class="label">Addresses</p>
                        <div>
                            <router-link v-for="(addr, i) in output.output.addresses"
                                         :to="`/address/${addr}`"
                                         :key="i">
                                {{addr}}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import api from "../axios";

    export default {
        data(){
            return{
                tx_data: null,
            }
        },
        created(){
            let parent = this;
            let url = `/x/transactions/${this.txId}`;
            api.get(url).then((res) => {
                const data = res.data;
                parent.tx_data = data;
                console.log(data.unsignedTx.initialStates[0].outputs[0])
            });
        },
        computed: {
            txId(){
                return this.$route.params.id;
            }
        }
    }
</script>
<style scoped>
    .transaction_details{
        padding: 30px 15vw;
    }

    .id{
        font-size: 4em;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .main_info{
        display: flex;

    }

    .main_info > div{
        margin-right: 14px;
    }

    .io{
        margin: 30px auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 30px;
    }


    .io_item{
        padding: 5px 12px;
        font-size: 12px;
        margin: 14px 0px;
        background-color: #f2f2f2;
        border-radius: 3px;
        border: 1px solid #eaeaea;
    }

    .label{
        font-size: 11px;
        font-weight: bold;
        letter-spacing: 0.1em;
        color: #808080;
        margin-top: 6px;
    }
</style>