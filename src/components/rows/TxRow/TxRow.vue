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
            <utxo-input v-for="(input,i) in inputs" :key="i" :input="input"></utxo-input>
        </div>
        <div class="to_amount">
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

    get tx_id() {
        return this.transaction.id;
    }

    get ago() {
        let stamp = this.transaction.timestamp;
        let date = new Date(stamp);
        return moment(date).fromNow();
    }

    get outputs() {
        let ins = this.inputs;

        let senders: string[] = [];

        for (let i = 0; i < ins.length; i++) {
            let input = ins[i];
            let addrs = input.output.addresses;
            senders.push(...addrs);
        }

        let outs = this.transaction.outputs;
        let res = outs;
        if (outs.length > 1) {
            res = outs.filter((val, index) => {
                let addrs = val.addresses;

                // If change UTXO then don't show
                let flag = false;
                addrs.forEach(addr => {
                    if (senders.includes(addr)) flag = true;
                });
                if (flag) return false;
                return true;
            });
        }

        return res;
    }

    get inputs() {
        let addedAddr: string[] = [];
        let ins = this.transaction.inputs || [];
        let res = ins.filter((val, index) => {
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
        return res;
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
    padding: 0px 10px;
    overflow: auto;
}

.utxo_out {
    margin-bottom: 6px;
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
        height: 27px;
        a {
            flex-grow: 1;
        }
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
}
</style>
