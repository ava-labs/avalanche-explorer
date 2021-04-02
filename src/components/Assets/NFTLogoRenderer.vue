<template>
    <div class="nft_container">
        <NFTPayload
            v-if="payloads || payloads.length > 0"
            :payload="payloads[0][0]"
            :asset-i-d="asset.id"
            :group-i-d="payloads[0][1]"
        ></NFTPayload>
        <img v-else class="table_image" :src="logo" alt />
    </div>
</template>

<script lang="ts">
import { Asset } from '@/js/Asset'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'
import NFTPayload from '@/components/Transaction/UtxoNFTPayload.vue'

@Component({
    components: {
        NFTPayload,
    },
})
export default class NFTLogoRenderer extends Vue {
    @Prop() asset!: Asset
    loading = true
    payloads: (string | number)[] | null = null

    created() {
        this.getPayloads()
    }

    getPayloads(): void {
        this.loading = true
        this.$store
            .dispatch('Transactions/getNFTPayloads', {
                id: this.asset.id,
            })
            .then((payloads) => {
                console.log('payloads', payloads)
                this.payloads = payloads
                this.loading = false
            })
            .catch((err) => {
                console.log(err)
            })
    }

    get logo(): string {
        return `/hex_ava_${this.hexColor}.svg`
    }

    get hexColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'mainnet' : 'testnet'
    }
}
</script>

<style scoped lang="scss">
.nft_container {
    display: inline-block;
}

.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -1px;
    margin-right: 14px;
    vertical-align: middle;
}
</style>
