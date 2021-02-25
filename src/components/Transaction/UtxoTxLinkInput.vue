<template>
    <div class="tx_link">
        <router-link :to="URL">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <fa v-on="on" icon="arrow-left" color="#2196f3"></fa>
                </template>
                <div>
                    <p>Created on {{ chain }} {{ timestamp | fromNow }}</p>
                    <p>
                        Tx ID: <span class="monospace">{{ txID }}</span>
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
