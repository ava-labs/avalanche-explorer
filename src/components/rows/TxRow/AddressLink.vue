<template>
    <div>
        <!-- X/P (internal route) -->
        <router-link v-if="isBech32" :to="internalURL" class="addr monospace">{{
            abbrev32
        }}</router-link>
        <!-- C (external route) -->
        <a v-else :href="`${externalURL}`" class="addr monospace"
            >{{ abbrev0x }}
        </a>
    </div>
</template>

<script lang="ts">
import {
    cChainExplorerURL,
    cChainExplorerURL_test,
    DEFAULT_NETWORK_ID,
} from '@/store/modules/network/network'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { abbreviateBech32, abbreviate0x } from '@/helper'

@Component({})
export default class AddressLink extends Vue {
    @Prop() address!: string

    get isBech32() {
        const prefix = this.address.substring(0, 2)
        return prefix !== '0x' ? true : false
    }

    get internalURL() {
        return `/address/${this.address}`
    }

    get externalURL() {
        return `${
            DEFAULT_NETWORK_ID === 1
                ? cChainExplorerURL
                : cChainExplorerURL_test
        }/address/${this.address}`
    }

    get abbrev32() {
        return abbreviateBech32(this.address)
    }
    get abbrev0x() {
        return abbreviate0x(this.address)
    }
}
</script>

<style scoped lang="scss"></style>
