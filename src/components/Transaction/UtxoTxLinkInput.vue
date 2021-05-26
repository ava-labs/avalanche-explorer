<template>
    <div class="tx_link">
        <router-link :to="URL">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <fa icon="arrow-left" color="#c4c4c4" v-on="on"></fa>
                </template>
                <div>
                    <p>
                        <span class="light">UTXO was created on</span>
                        {{ chain }}
                        {{ timestamp | fromNow }}
                    </p>
                    <p>
                        <span class="light">Tx ID: </span>
                        <span class="monospace">{{ txID }}</span>
                    </p>
                </div>
            </v-tooltip>
        </router-link>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getOutputType } from '@/services/transactions'
import { getTransactionChainType } from '@/js/Transaction'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoTxLinkInput extends Vue {
    @Prop() txID!: string | null
    @Prop() chainID!: string
    @Prop() timestamp!: string

    get URL(): string {
        return `/tx/${this.txID}`
    }

    get chain(): string {
        return getTransactionChainType(this.chainID)?.name || ''
    }
}
</script>

<style scoped lang="scss"></style>
