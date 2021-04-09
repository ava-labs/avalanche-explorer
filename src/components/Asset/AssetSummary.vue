<template>
    <div class="asset_header">
        <div class="card">
            <div class="header">
                <h2>
                    {{ asset | name }}
                    <span class="symbol">{{ asset.symbol }}</span>
                </h2>
            </div>
            <div class="two_column">
                <Metadata :asset="asset" />
                <section>
                    <TransactionHistory v-if="isAVAX" />
                    <NFTRenderer v-if="isNFT" :asset="asset" />
                </section>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import { AVAX_ID } from '@/known_assets'
import Metadata from '@/components/Asset/Metadata.vue'
import TransactionHistory from '@/components/Home/TopInfo/TransactionHistory.vue'
import NFTRenderer from '@/components/Asset/NFTRenderer.vue'

@Component({
    components: {
        Metadata,
        TransactionHistory,
        NFTRenderer,
    },

    filters: {
        name(val: Asset): string {
            return val.name ? val.name : val.id
        },
    },
})
export default class AssetSummary extends Vue {
    @Prop() asset!: Asset

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

.two_column {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
}

@include xsOnly {
    .asset_header {
        margin-bottom: 10px;

        .header {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
