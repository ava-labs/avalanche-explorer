<template>
    <div class="nft_container">
        <NFTLogoPayload
            v-if="payloads || payloads.length > 0"
            :payload="payloads[0][0]"
            :asset-i-d="asset.id"
            :group-i-d="payloads[0][1]"
        ></NFTLogoPayload>
        <LogoFallback v-else></LogoFallback>
    </div>
</template>

<script lang="ts">
import { Asset } from '@/js/Asset'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import NFTLogoPayload from '@/components/Assets/NFTLogoPayload.vue'
import LogoFallback from '@/components/Assets/LogoFallback.vue'

@Component({
    components: {
        NFTLogoPayload,
        LogoFallback,
    },
})
export default class NFTLogoRenderer extends Vue {
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
}
</style>
