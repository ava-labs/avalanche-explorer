<template>
    <div class="transaction_details">
        <div class="meta" v-if="tx_data">
            <h1>Transaction Details</h1>
            <div class="meta_row">
                <p class="label">ID</p>
                <p>{{txId}}</p>
            </div>
            <div class="meta_row">
                <p class="label">Network</p>
                <p>{{networkId}}</p>
            </div>
            <div class="meta_row">
                <p class="label">Blockchain</p>
                <p>{{chainId}}</p>
            </div>
        </div>

        <div v-if="tx_data" class="io">
            <div class="inputs" v-if="inputs.length > 0">
                <h4>Inputs</h4>
                <utxo-input class="io_item" v-for="(input, i) in inputs" :key="i" :input="input"></utxo-input>
            </div>
            <div v-else class="inputs_genesis">
                <p>Asset Genesis</p>
            </div>
            <div class="outputs">
                <h4>Outputs</h4>
                <Output  class="io_item" v-for="(output, i) in tx_data.unsignedTx.outputs"
                         :key="i" :output="output"></Output>
            </div>
        </div>
    </div>
</template>
<script>
    import api from "../axios";

    import Output from "../components/Transaction/Output";
    import UtxoInput from "../components/Transaction/Input";
    import {Transaction} from "../js/Transaction";

    export default {
        components: {
            UtxoInput,
            Output
        },
        data(){
            return{
                tx_data: null,
            }
        },
        created(){
            this.getData();
        },
        watch: {
            txId(val){
                this.getData();
            }
        },
        computed: {
            txId(){
                return this.$route.params.id;
            },
            networkId(){
                return this.tx_data.unsignedTx.networkID
            },
            chainId(){
                return this.tx_data.unsignedTx.blockchainID
            },
            inputs(){
                return this.tx_data.inputs || [];
            }
        },
        methods:{
            getData(){
                let parent = this;
                let url = `/x/transactions/${this.txId}`;
                api.get(url).then((res) => {
                    const data = res.data;
                    parent.tx_data = data;
                    let tx = new Transaction(data);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>
<style lang="scss">
    .transaction_details{
        a{
            max-width: 90px;
            overflow: hidden;
            display: block;
            text-overflow: ellipsis;
            color: #71C5FF;
            text-decoration: none;

            &:hover{
                text-decoration: underline;
            }
        }
    }
</style>
<style scoped lang="scss">
    @use '../main';
    h1{
        margin: 0;
        font-size: 16px;
        margin-left: 80px;
        margin-bottom: 12px;
    }


    .transaction_details{
        padding: main.$container_padding_l;
        font-size: 13px;


        > div{

        }
    }

    .meta{
        background-color: #fff;
        padding: 30px;
        border-radius: 6px;
        word-break: break-all;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }

    .meta_row{
        /*display: flex;*/
        display: grid;
        grid-template-columns: 80px 1fr;
        margin-bottom: 8px;
        .label{
            font-weight: bold;
            text-align: right;
            margin-right: 8px;
        }
    }

    .id{
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
        padding: 15px 30px;
        font-size: 13px;
        margin: 14px 0px;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }

    .inputs_genesis{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        p{
            padding: 16px 30px;
            background-color: #e6ffe6;
            border-radius: 4px;
            border: 1px solid #56C18D;
            color: #56C18D;
            font-size: 16px;
            text-align: center;
        }
    }

    /*.label{*/
    /*    font-size: 11px;*/
    /*    font-weight: bold;*/
    /*    letter-spacing: 0.1em;*/
    /*    color: #808080;*/
    /*    margin-top: 6px;*/
    /*}*/

    @media only screen and (max-width: main.$mobile_width) {
        .transaction_details{
            padding: main.$container_padding_mobile;
        }

        .io{
            grid-template-columns: none;
            grid-template-rows: max-content max-content;
        }
        .io_item{
            padding: 12px;
        }

        .data_row{
        }
    }
</style>
