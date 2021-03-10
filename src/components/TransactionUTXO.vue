<template>
    <section v-if="tx" class="utxo">
        <article class="card meta">
            <h3 class="label">
                {{
                    inputs.length
                        | pluralizeWithoutCount('Input')
                        | qualifyInput(tx.type)
                }}
                <span class="utxo_count">{{ inputs.length }}</span>
            </h3>
            <div v-if="inputs.length > 0">
                <UtxoRowInput
                    v-for="(input, i) in inputs"
                    :key="i"
                    :utxo="input"
                ></UtxoRowInput>
            </div>
            <div v-else>
                <p>
                    No input UTXOs found for this transaction on the Avalanche
                    Explorer.
                </p>
            </div>
        </article>
        <article class="card meta">
            <h3 class="label">
                {{
                    outputs.length
                        | pluralizeWithoutCount('Output')
                        | qualifyOutput(tx.type)
                }}
                <span class="utxo_count">{{ outputs.length }}</span>
            </h3>
            <div v-if="tx.outputs.length > 0">
                <UtxoRowOutput
                    v-for="(output, i) in outputs"
                    :key="i"
                    :utxo="output"
                    :txtype="tx.type"
                    type="output"
                ></UtxoRowOutput>
            </div>
            <div v-else>
                <p>No output utxos found for this transaction.</p>
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import UtxoRowInput from '@/components/Transaction/UtxoRowInput.vue'
import UtxoRowOutput from '@/components/Transaction/UtxoRowOutput.vue'
import {
    getMappingForType,
    Transaction,
    getTransactionOutputs,
    getTransactionInputs,
} from '../js/Transaction'
import { toAVAX } from '../helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import { getAssetType } from '@/services/assets'

@Component({
    components: {
        UtxoRowInput,
        UtxoRowOutput,
        Tooltip,
        CopyText,
    },
    filters: {
        getType: getMappingForType,
        toAVAX,
        getAssetType,
    },
})
export default class TransactionUTXO extends Vue {
    @Prop() tx!: Transaction

    get inputs() {
        return getTransactionInputs(this.tx.inputs)
    }

    get outputs() {
        return getTransactionOutputs(this.tx.outputs)
    }

    get assets(): any {
        return this.$store.state.assets
    }

    get isAssetGenesis(): boolean {
        return this.tx.type === 'create_asset'
    }
}
</script>

<style scoped lang="scss">
.utxo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 30px;
    margin-top: 30px;
}

.decode {
    display: inline-block;
    color: $primary-color-light;
    width: 60px;
    font-size: 12px;
}
</style>
