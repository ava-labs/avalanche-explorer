<template>
    <div>
        <!-- bech32 (internal route) -->
        <router-link v-if="isBech32" :to="internalURL" class="addr monospace">
            <span>{{ abbrev32[0] }}</span>
            <span>{{ abbrev32[1] }}</span>
            <span class="bold">{{ abbrev32[2] }}</span>
            <span>{{ abbrev32[3] }}</span>
            <span class="bold">{{ abbrev32[4] }}</span>
        </router-link>
        <!-- 0x (external route) -->
        <a v-else :href="`${externalURL}`" class="addr monospace">
            <span>{{ abbrevHex[0] }}</span>
            <span class="bold">{{ abbrevHex[1] }}</span>
            <span>{{ abbrevHex[2] }}</span>
            <span class="bold">{{ abbrevHex[3] }}</span>
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
import { abbreviateBech32, abbreviateHex } from '@/helper'

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

    get abbrevHex() {
        return abbreviateHex(this.address)
    }
}
</script>

<style scoped lang="scss">
.bold {
    font-weight: 700;
}
</style>
