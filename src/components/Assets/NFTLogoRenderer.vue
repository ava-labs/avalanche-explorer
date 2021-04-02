<template>
    <div>
        <img class="table_image" :src="logo" alt />
    </div>
</template>

<script lang="ts">
import { Asset } from '@/js/Asset'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({
    components: {},
})
export default class NFTLogoRenderer extends Vue {
    @Prop() asset!: Asset
    loading: boolean = true

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
.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -1px;
    margin-right: 14px;
    vertical-align: middle;
}
</style>
