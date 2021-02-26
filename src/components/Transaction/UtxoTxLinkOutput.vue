<template>
    <div class="tx_link">
        <router-link v-if="isXP" :to="xpURL">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <fa v-on="on" icon="arrow-right" color="#2196f3"></fa>
                    <!-- ><fa icon="check-circle" class="redeemed"></fa -->
                </template>
                <div v-if="redeemed">
                    <p>Redeemed on {{ chainID }} {{ timestamp | fromNow }}</p>
                    <p>
                        Tx ID: <span class="monospace">{{ txID }}</span>
                    </p>
                </div>
            </v-tooltip>
        </router-link>
        <a v-else :href="cURL">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <fa v-on="on" icon="arrow-right" color="#2196f3"></fa>
                </template>
                <div v-if="redeemed">
                    <p>Redeemed on {{ chainID }} {{ timestamp | fromNow }}</p>
                    <p>
                        Tx ID: <span class="monospace">{{ txID }}</span>
                    </p>
                </div>
            </v-tooltip>
        </a>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getOutputType } from '@/services/transactions'
import { PChainInfo, XChainInfo } from '@/helper'
import {
    DEFAULT_NETWORK_ID,
    cChainExplorerURL,
    cChainExplorerURL_test,
} from '@/store/modules/network/network'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoTxLinkOutput extends Vue {
    @Prop() txID!: string | null
    @Prop() chainID!: string
    @Prop() timestamp!: string
    @Prop() redeemed!: boolean

    created() {
        console.log('redeemed', this.redeemed)
        console.log('txID', this.txID)
    }

    get isXP(): boolean {
        return this.chainID === XChainInfo.id || this.chainID === PChainInfo.id
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
}
</script>

<style scoped lang="scss"></style>
