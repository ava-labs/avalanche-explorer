<template>
    <div>
        <div class="utxo_label">{{ type | fromOrTo }}</div>
        <div v-for="({ address, displayAddress }, i) in addresses" :key="i">
            <!-- X/P (internal route) -->
            <router-link
                v-if="isXP(displayAddress)"
                :to="xpURL(address)"
                class="address monospace compound_interest"
                >{{ displayAddress }}</router-link
            >
            <!-- C (external route) -->
            <a
                v-else
                :href="`${cURL(address)}`"
                class="address monospace compound_interest"
                >{{ displayAddress }}
            </a>
        </div>

        <div></div>
    </div>
</template>

<script lang="ts">
import { DisplayAddress } from '@/js/Transaction'
import {
    cChainExplorerURL,
    cChainExplorerURL_test,
    DEFAULT_NETWORK_ID,
} from '@/store/modules/network/network'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
    filters: {
        fromOrTo(val: string) {
            return val === 'input' ? 'From' : 'To'
        },
    },
})
export default class UtxoAddresses extends Vue {
    @Prop() addresses!: DisplayAddress[]
    @Prop() type!: string

    isXP(id: string) {
        const prefix = id.substring(0, 2)
        return prefix !== '0x' ? true : false
    }

    xpURL(id: string) {
        return `/address/${id}`
    }

    cURL(id: string) {
        return `${
            DEFAULT_NETWORK_ID === 1
                ? cChainExplorerURL
                : cChainExplorerURL_test
        }/address/${id}`
    }
}
</script>

<style scoped lang="scss"></style>
