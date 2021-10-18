<template>
    <div class="card asset_header">
        <header class="header">
            <h2>
                {{ asset | nameOrID }}
                <span class="symbol">{{ asset.symbol }}</span>
            </h2>
        </header>
        <div class="two_column">
            <Metadata :asset="asset" :genesis-tx="genesisTx" />
            <section>
                <NFTRenderer v-if="isNFT" :asset="asset" />
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import { AVAX_ID } from '@/known_assets'
import Metadata from '@/components/Asset/Metadata.vue'
import NFTRenderer from '@/components/Asset/NFTRenderer.vue'
import { Transaction } from '@/js/Transaction'

@Component({
    components: {
        Metadata,
        NFTRenderer,
    },
})
export default class AssetSummary extends Vue {
    @Prop() asset!: Asset
    @Prop() genesisTx!: Transaction

    get isAVAX() {
        return this.asset.id === AVAX_ID
    }

    get isNFT() {
        return this.asset.nft === 1
    }
}
</script>

<style scoped lang="scss">
.asset_header {
    margin-bottom: 15px;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .symbol {
        flex-shrink: 0;
        color: $secondary-color;
        background-color: $secondary-color-xlight;
        min-height: 1em;
        min-width: 20px;
        text-align: center;
        margin: 0px 10px 5px;
        padding: 3px 4px;
        font-size: 9px;
        border-radius: 3px;
        display: inline-block;
        vertical-align: middle;
    }
}

@include xsOrSmaller {
    .asset_header {
        margin-bottom: 10px;

        .header {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
