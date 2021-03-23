<template>
    <div class="tx_row">
        <div class="avatar">
            <p>Tx</p>
        </div>
        <div class="info_col id_col">
            <router-link :to="`/tx/${transaction.id}`" class="id"
                >{{ transaction.id }}...</router-link
            >
            <p class="time">{{ transaction.timestamp | fromNow }}</p>
            <span class="type">
                <span class="label">TYPE:</span>
                <span class="value"> {{ transaction.type | getType }}</span>
            </span>
        </div>
        <div class="info_col">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label"></span>
            <template v-if="transaction.type === 'import'">
                <div class="tx_type_label import_tx">
                    imported from other Chain
                </div>
            </template>
            <template v-else>
                <utxo-input
                    v-for="(input, i) in inputs"
                    :key="i"
                    :input="input"
                ></utxo-input>
            </template>
        </div>
        <div v-if="isGenesisVertex" class="to_amount">
            <div class="info_col">
                <router-link :to="`/tx/${tx_id}`" class="view_all"
                    >Explore Genesis Vertex</router-link
                >
            </div>
        </div>
        <div v-else class="to_amount">
            <template v-if="transaction.type === 'export'">
                <div class="info_col tx_type_label export_tx">
                    exported to other Chain
                </div>
            </template>
            <template> </template>
            <output-utxo
                v-for="(output, i) in outputs"
                :key="i"
                class="utxo_out"
                :output="output"
            ></output-utxo>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import UtxoInput from '@/components/rows/TxRow/InputUtxo.vue'
import OutputUtxo from '@/components/rows/TxRow/OutputUtxo.vue'
import { getMappingForType, Transaction } from '@/js/Transaction'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({
    components: {
        UtxoInput,
        OutputUtxo,
    },
    filters: {
        getType: getMappingForType,
    },
})
export default class TxRow extends Vue {
    @Prop() transaction!: Transaction

    get isGenesisVertex(): boolean {
        const genesisTxID =
            DEFAULT_NETWORK_ID === 1
                ? process.env.VUE_APP_AVAXID
                : process.env.VUE_APP_TEST_AVAXID
        return this.transaction.id === genesisTxID ? true : false
    }

    get inputs() {
        const addedAddr: string[] = []
        const ins = this.transaction.inputs || []

        const res = ins.filter((val) => {
            const addrs = val.output.addresses
            let flag = false
            addrs.forEach((addr) => {
                if (addedAddr.includes(addr)) {
                    flag = true
                } else {
                    addedAddr.push(addr)
                }
            })
            if (flag) return false
            return true
        })

        return res
    }

    get outputs() {
        // INPUT UTXOS
        const ins = this.inputs
        const senders: string[] = []

        // INPUT ADDRESSES
        for (let i = 0; i < ins.length; i++) {
            const input = ins[i]
            const addrs = input.output.addresses
            // addrs.forEach(addr => console.log("                  ", addr.substring(6, 11)));
            senders.push(...addrs)
        }

        // OUTPUT UTXOS
        const outputUTXOs = this.transaction.outputs
        let recipients = outputUTXOs

        if (outputUTXOs) {
            // TODO: reinstate filter when Tx Types are supported
            // Hide change UTXO for multiple outputs
            // output UTXO addresses
            // if (outputUTXOs.length > 1) {
            //     recipients = outputUTXOs.filter((UTXO, i) => {
            //         let flag = false;
            //         UTXO.addresses.forEach(addr => console.log("                  ", addr.substring(6, 11), "                ", i) );
            //         UTXO.addresses.forEach(addr => {
            //             if (senders.includes(addr)) {
            //                 flag = true;
            //             }
            //         });
            //         return flag ? false : true;
            //     });
            // }
            // Hide nothing
            // else {
            //     recipients = outputUTXOs;
            // }
            // console.log("%c  tos         ", 'background: #FFF; color: #bada55', recipients.map(utxo => utxo.addresses));
            recipients = outputUTXOs
        }

        return recipients
    }
}
</script>
<style scoped lang="scss">
.tx_row {
    padding: 12px 0px;
    position: relative;
    display: grid;
    grid-template-columns: 40px 0.62fr 0.9fr 1.5fr;
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
    color: $primary-color-light;
    word-break: keep-all;
    white-space: nowrap;
    line-height: 21px;
}

.type {
    font-size: 10px;
    .label {
        font-size: 8px;
        color: #bdbdbd;
    }
    .value {
        color: $secondary-color;
    }
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
    font-size: 0.875em;
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
        height: 50px;
        a {
            flex-grow: 1;
        }
    }

    .type {
        padding-top: 4px;
        padding-bottom: 4px;
    }

    .time {
        line-height: 11px;
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
        height: 50px;

        a {
            flex-grow: 1;
        }
    }

    .time {
        line-height: 11px;
    }

    .type {
        padding-top: 4px;
        padding-bottom: 4px;
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
