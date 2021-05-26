<template>
    <div class="tx_link">
        <!-- SPENT -->
        <template v-if="txID">
            <!-- X/P (internal route) -->
            <router-link v-if="isXP" :to="xpURL">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <fa icon="arrow-right" color="#c4c4c4" v-on="on"></fa>
                    </template>
                    <div>
                        <p>
                            <span class="light">UTXO was spent on</span>
                            {{ chain }}
                        </p>
                        <p>
                            <span class="light">Tx ID: </span>
                            <span class="monospace">{{ txID }}</span>
                        </p>
                    </div>
                </v-tooltip>
            </router-link>
            <!-- C (external route) -->
            <a v-else :href="cURL">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <fa icon="arrow-right" color="#c4c4c4" v-on="on"></fa>
                    </template>
                    <div>
                        <p>
                            <span class="light">UTXO was spent on</span
                            >{{ chain }}
                        </p>
                        <p>
                            <span class="light">Tx ID: </span>
                            <span class="monospace">{{ txID }}</span>
                        </p>
                    </div>
                </v-tooltip>
            </a>
        </template>
        <!-- SPENDABLE -->
        <template v-else>
            <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <fa icon="info-circle" color="#e4e4e4" v-on="on"></fa>
                </template>
                <div>
                    <p>
                        <span class="light">Unspent UTXO on</span>
                        {{ chain }}
                    </p>
                </div>
            </v-tooltip>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getOutputType } from '@/services/transactions'
import { P, X } from '@/known_blockchains'
import {
    DEFAULT_NETWORK_ID,
    cChainExplorerURL,
    cChainExplorerURL_test,
} from '@/store/modules/network/network'
import { getTransactionChainType } from '@/js/Transaction'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoTxLinkOutput extends Vue {
    @Prop() txID!: string | null
    @Prop() chainID!: string
    @Prop() timestamp!: string

    get isXP(): boolean {
        return this.chainID === X.id || this.chainID === P.id
    }

    get xpURL(): string {
        return `/tx/${this.txID}`
    }

    get cURL(): string {
        return `${
            DEFAULT_NETWORK_ID === 1
                ? cChainExplorerURL
                : cChainExplorerURL_test
        }/tx/0x${this.txID}`
    }

    get chain(): string {
        return getTransactionChainType(this.chainID)?.name || ''
    }
}
</script>

<style scoped lang="scss"></style>
