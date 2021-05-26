<template>
    <img class="logo_image" :src="logo" alt />
</template>

<script lang="ts">
import { Asset } from '@/js/Asset'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'
import dict from '@/known_assets'

@Component({
    components: {},
})
export default class AssetLogoRenderer extends Vue {
    @Prop() asset!: Asset

    get logo(): string {
        return dict[this.asset.id]
            ? dict[this.asset.id].logo
            : `/hex_ava_${this.hexColor}.svg`
    }

    get hexColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'mainnet' : 'testnet'
    }
}
</script>

<style scoped lang="scss"></style>
