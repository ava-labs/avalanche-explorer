<template>
    <div>
        <!-- X/P (internal route) -->
        <router-link
            v-if="isXP(address)"
            :to="xpURL(address)"
            class="addr monospace"
            >{{ address }}</router-link
        >
        <!-- C (external route) -->
        <a v-else :href="`${cURL(address)}`" class="addr monospace"
            >{{ address }}
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

@Component({})
export default class AddressLink extends Vue {
    @Prop() address!: string

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
