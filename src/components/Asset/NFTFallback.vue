<template>
    <div :style="dimensions">
        <img :src="fallback" alt />
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({})
export default class NFTFallback extends Vue {
    @Prop() size?: number

    get dimensions(): any {
        return this.size
            ? { maxWidth: `${this.size}px`, maxHeight: `${this.size}px}` }
            : { width: `100%`, height: `100%` }
    }
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
