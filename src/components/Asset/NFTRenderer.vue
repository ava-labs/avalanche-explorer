<template>
    <div class="nft_container">
        <template v-if="payloads">
            <NFTPayload
                v-if="payloads.length > 0"
                :payload="payloads[0][0]"
                :asset-i-d="asset.id"
                :group-i-d="payloads[0][1]"
            ></NFTPayload>
            <NFTFallback v-else></NFTFallback>
        </template>
        <NFTFallback v-else></NFTFallback>
    </div>
</template>

<script lang="ts">
import { Asset } from '@/js/Asset'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import NFTPayload from '@/components/Asset/NFTPayload.vue'
import NFTFallback from '@/components/Asset/NFTFallback.vue'

@Component({
    components: {
        NFTPayload,
        NFTFallback,
    },
})
export default class NFTRenderer extends Vue {
    @Prop() asset!: Asset
    loading = true
    payloads: (string | number)[] | null = null
    payload: string | null = null

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
}
</script>

<style scoped lang="scss">
.nft_container {
    display: inline-block;
    width: 25px;
    height: 25px;
}
</style>
