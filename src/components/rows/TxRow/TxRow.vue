<template>
    <div class="tx_row">
        <div class="avatar">
            <p>Tx</p>
        </div>
        <div class="info_col id_col">
            <router-link :to="`/tx/${tx_id}`" class="id">{{tx_id}}...</router-link>
            <p class="time">{{ago}}</p>
        </div>
        <div class="info_col">
            <span class="label" v-if="$vuetify.breakpoint.smAndDown"></span>
            <template v-if="transaction.type === 'import'">
                <div class="tx_type_label import_tx">imported from other Chain</div>
            </template>
            <template v-else>
                <utxo-input v-for="(input,i) in inputs" :key="i" :input="input"></utxo-input>
            </template>
        </div>
        <div class="to_amount" v-if="isGenesisVertex">
            <div class="info_col">
                <router-link :to="`/tx/${tx_id}`" class="view_all">Explore Genesis Vertex</router-link>
            </div>
        </div>
        <div class="to_amount" v-else>
            <template v-if="transaction.type === 'export'">
                <div class="info_col tx_type_label export_tx">exported to other Chain</div>
            </template>
            <template>
            </template>
            <output-utxo class="utxo_out" v-for="(output,i) in outputs" :key="i" :output="output"></output-utxo>
        </div>
    </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import UtxoInput from "@/components/rows/TxRow/InputUtxo.vue";
import OutputUtxo from "@/components/rows/TxRow/OutputUtxo.vue";
import moment from "moment";
import { Asset } from '@/js/Asset';
import { Transaction } from '@/js/Transaction';
import { DEFAULT_NETWORK_ID } from "@/store/modules/network/network";

@Component({
    components: {
        UtxoInput,
        OutputUtxo
    }
})
export default class TxRow extends Vue {
    @Prop() transaction!: Transaction;
    
    get assets() {
        return this.$store.state.assets;
    }

    get isGenesisVertex(): boolean {
        let genesisTxID = (DEFAULT_NETWORK_ID === 1) ? process.env.VUE_APP_AVAXID : process.env.VUE_APP_TEST_AVAXID;
        return (this.transaction.id === genesisTxID) ? true : false;
    }

    get tx_id() {
        // console.log("");
        // console.log("");
        // console.log("================================================================================================================");
        // console.log("");
        console.log("==", this.transaction.id);
        console.log("  ", this.transaction.type);
        // console.log("");
        return this.transaction.id;
    }

    get ago() {
        let stamp = this.transaction.timestamp;
        let date = new Date(stamp);
        return moment(date).fromNow();
    }

    get inputs() {
        // console.log("== GET INPUTS ==");
        let addedAddr: string[] = [];
        let ins = this.transaction.inputs || [];
        // console.log("> ins         ", ins);
        
        let res = ins.filter(val => {
            let addrs = val.output.addresses;
            let flag = false;
            addrs.forEach(addr => {
                if (addedAddr.includes(addr)) {
                    flag = true;
                } else {
                    addedAddr.push(addr);
                }
            });
            if (flag) return false;
            return true;
        });

        // console.log("  input res   ", res);
        return res;
    }

    get outputs() {
        // console.log("");
        // console.log("== GET OUTPUTS ==");
        
        // INPUT UTXOS
        let ins = this.inputs;
        let senders: string[] = [];        
        // console.log("> ins         ", ins);
        
        // INPUT ADDRESSES
        for (let i = 0; i < ins.length; i++) {
            let input = ins[i];
            let addrs = input.output.addresses;
            // addrs.forEach(addr => console.log("                  ", addr.substring(6, 11)));
            senders.push(...addrs);
        }
        // console.log("%c  froms       ", 'background: #222; color: #bada55', senders);
        // console.log("--");


        // OUTPUT UTXOS
        let outs = this.transaction.outputs;
        let recipients = outs;
       
        console.log("> outs        ", outs);

        // output UTXO addresses
        if (outs) {
            if (outs.length > 1) {
            recipients = outs.filter((val, i) => {
                let addrs = val.addresses;
                // addrs.forEach(addr => console.log("                  ", addr.substring(6, 11), "                ", i) );
                let flag = false;
                // Hide change UTXO for multiple outputs 
                if (outs.length > 1) {
                    addrs.forEach(addr => {
                        if (senders.includes(addr)) {
                            flag = true;
                        }
                    });
                }
                return flag ? false : true;
            });
        }
        // console.log("%c  tos         ", 'background: #222; color: #bada55', recipients.map(utxo => utxo.addresses));
        }
        
        return recipients;
    }    
}
</script>
<style scoped lang="scss">

.tx_row {
    padding: 12px 0px;
    position: relative;
    display: grid;
    grid-template-columns: 40px .62fr 1.2fr 1.2fr;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
}

.avatar {
    width: 35px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    background-color: $white;
    border: 2px solid $primary-color;

    p {
        width: 100%;
        font-weight: 500;
        color: $primary-color;
    }
}

.id {
    color: $primary-color-light !important;
    text-decoration: none;
    font-weight: 400; /* 700 */
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
}

.time {
    font-weight: 400;
    font-size: 10px;
    margin-top: 5px;
    color: $primary-color-light;
    word-break: keep-all;
    white-space: nowrap;
}
.label {
    font-size: 12px;
    font-weight: 400; /* 700 */
    overflow: hidden;
}
.data {
    display: flex;
}

.info_col {
    display: flex;
    flex-direction: column;
    justify-items: center;
    padding: 0px 10px;
    overflow: auto;
}

.utxo_out {
    margin-bottom: 6px;
}

.tx_type_label {
    color: $primary-color-light;
    font-style: italic;
    font-size: .875em;
    min-height: 16px;
    display: flex;
    align-items: flex-start;
    padding-top: 6px;
    padding-bottom: 6px;
}

@include smOnly {
    .tx_row {
        padding: 8px;
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content max-content max-content;
    }

    .avatar {
        display: none;
    }

    .id_col {
        display: flex;
        align-items: baseline;
        height: 27px;
        a {
            flex-grow: 1;
        }
    }
}

@include xsOnly {
    .tx_row {
        padding: 8px;
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content max-content max-content;
    }

    .avatar {
        display: none;
    }

    .id_col {
        display: flex;
        align-items: baseline;
        height: 32px;
        
        a {
            flex-grow: 1;
        }
    }

    .time {
        margin-top: 0;
    }

    .id {
        margin-bottom: 4px;
    }

    .tx_row {
        padding: 8px 0;
    }
    
    .info_col {
        padding: 0 10px 0 0;
    }

    .utxo_out {
        margin-bottom: 2px;
    }

    .tx_type_label {
        padding-left: 42px;
    }
}
</style>
