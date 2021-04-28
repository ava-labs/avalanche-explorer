<template>
    <div class="tx_row">
        <!-- DETAILS -->
        <div class="info_col id_col">
            <router-link :to="`/tx/${transaction.id}`" class="id monospace"
                >{{ transaction.id }}...</router-link
            >
            <p class="time">{{ transaction.timestamp | fromNow }}</p>
        </div>
        <!-- CHAIN -->
        <div
            class="avatar"
            :style="{
                backgroundColor: chainDarkColor,
            }"
        >
            <p
                :style="{
                    color: chainColor,
                }"
            >
                {{ chainCode }}
            </p>
        </div>
        <!-- FROM -->
        <div class="info_col utxo_list">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label"></span>
            <template v-else>
                <InputUTXO
                    v-for="(input, i) in inputs"
                    :key="i"
                    :input="input"
                />
            </template>
        </div>
        <!-- TYPE -->
        <div class="type">
            <span>
                <span
                    class="value"
                    :style="{
                        color: chainColor,
                    }"
                >
                    {{ transaction.type | getType }}</span
                >
            </span>
        </div>
        <!-- TO -->
        <div class="info_col utxo_list">
            <template v-if="isGenesisVertex">
                <router-link :to="`/tx/${tx_id}`" class="view_all"
                    >Explore Genesis Vertex</router-link
                >
            </template>
            <template v-else>
                <OutputUTXO
                    v-for="(output, i) in outputs"
                    :key="i"
                    :output="output"
                />
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
    Transaction,
    getTransactionOutputs,
    getTransactionInputs,
} from '@/js/Transaction'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'
import { getTxChainType } from '@/known_blockchains'
import { getMappingForType } from '@/store/modules/transactions/maps'

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

    get chainColor() {
        return getTxChainType(this.transaction.chainID)!.color
    }

    get chainDarkColor() {
        return getTxChainType(this.transaction.chainID)!.darkColor
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
<style scoped lang="scss"></style>
