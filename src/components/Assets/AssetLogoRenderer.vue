<template>
    <img class="table_image" :src="src" alt />
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

    get hexColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'mainnet' : 'testnet'
    }

    get type(): string {
        return this.asset.nft === 1
            ? 'NFT'
            : this.asset.variableCap === 1
            ? 'Variable Cap'
            : 'Fixed Cap'
    }

    get src(): string {
        let src = ''
        if (this.type === 'Fixed Cap' || this.type === 'Variable Cap') {
            src = this.getLogo(this.asset.id)
        }
        return src
    }

    getLogo(id: string) {
        return dict[id] ? dict[id].logo : `/hex_ava_${this.hexColor}.svg`
    }
}
</script>

<style scoped lang="scss">
.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -1px;
    margin-right: 14px;
    vertical-align: middle;
}
</style>
