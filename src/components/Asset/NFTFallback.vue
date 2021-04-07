<template>
    <img :src="fallback" alt />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({})
export default class NFTFallback extends Vue {
    get fallback(): string {
        return `/hex_ava_${this.hexColor}.svg`
    }

    get hexColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'mainnet' : 'testnet'
    }
}
</script>

<style scoped lang="scss">
img {
    width: 100%;
    height: 100%;
}
</style>
