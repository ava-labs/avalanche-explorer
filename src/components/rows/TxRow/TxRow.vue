<template>
    <div class="tx_row">
        <!-- CHAIN -->
        <div class="avatar">
            <p>{{ chainCode }}</p>
        </div>
        <!-- DETAILS -->
        <div class="info_col id_col">
            <router-link :to="`/tx/${transaction.id}`" class="id monospace"
                >{{ transaction.id }}...</router-link
            >
            <p class="time">{{ transaction.timestamp | fromNow }}</p>
            <span class="type">
                <span class="value"> {{ transaction.type | getType }}</span>
            </span>
        </div>
        <!-- FROM -->
        <div class="info_col">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label"></span>
            <template v-else>
                <InputUTXO
                    v-for="(input, i) in inputs"
                    :key="i"
                    :input="input"
                ></InputUTXO>
            </template>
        </div>
        <!-- TO -->
        <div class="info_col">
            <template v-if="isGenesisVertex">
                <router-link :to="`/tx/${tx_id}`" class="view_all"
                    >Explore Genesis Vertex</router-link
                >
            </template>
            <template v-else>
                <OutputUTXO
                    v-for="(output, i) in outputs"
                    :key="i"
                    class="utxo_out"
                    :output="output"
                ></OutputUTXO>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import InputUTXO from '@/components/rows/TxRow/InputUtxo.vue'
import OutputUTXO from '@/components/rows/TxRow/OutputUtxo.vue'
import {
    getMappingForType,
    Transaction,
    getTransactionOutputs,
    getTransactionInputs,
} from '@/js/Transaction'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'
import { getTxChainType } from '@/services/transactions'

@Component({
    components: {
        InputUTXO,
        OutputUTXO,
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

    get chainCode() {
        return getTxChainType(this.transaction.chainID)!.code
    }

    /**
     * Returns a list of unique addresses found in Input UTXOs
     */
    get inputs() {
        const addresses = getTransactionInputs(this.transaction.inputs).flatMap(
            (output) => output.output.addresses
        )

        /**
         * This is just making sure that the addresses is a unique set with no repeats
         */
        return Array.from(
            new Set(addresses.map((address) => address.address))
        ).map((address) => {
            return {
                address,
                ...addresses.find((a) => a.address === address),
            }
        })
    }

    get outputs() {
        return getTransactionOutputs(this.transaction.outputs)
    }
}
</script>
<style scoped lang="scss">
.avatar {
    width: 35px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    background-color: $primary-color-xlight;

    p {
        width: 100%;
        font-weight: 400;
        color: $primary-color;
        font-size: 16px;
    }
}

.id {
    text-decoration: none;
    font-weight: 400;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $black !important;
}

.time {
    line-height: 140%;
    color: #000000;
    font-size: 10px;
    word-break: keep-all;
    white-space: nowrap;
}

.type {
    font-size: 10px;
    .value {
        color: $secondary-color;
    }
}

.label {
    font-size: 12px;
    font-weight: 400;
    overflow: hidden;
}
.data {
    display: flex;
}

.utxo_out {
    padding-left: 10px;
    padding-right: 10px;
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
</style>
