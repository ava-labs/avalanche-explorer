<template>
    <img class="logo_image" :src="logo" alt />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({})
export default class LogoFallback extends Vue {
    get logo(): string {
        return `/hex_ava_${this.hexColor}.svg`
    }

    get hexColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'mainnet' : 'testnet'
    }
}
</script>

<style scoped lang="scss">
.logo_image {
    height: 20px;
    display: inline-block;
    margin-top: -1px;
    margin-right: 14px;
    vertical-align: middle;
}
</style>
