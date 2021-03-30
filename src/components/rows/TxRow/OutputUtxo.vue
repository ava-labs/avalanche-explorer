<template>
    <div class="to">
        <div class="addresses">
            <div v-for="(addr, i) in addresses" :key="i" class="addr_container">
                <span v-if="$vuetify.breakpoint.smAndDown" class="label"
                    >To</span
                >
                <AddressLink :address="addr.displayAddress"></AddressLink>
            </div>
        </div>
        <div class="amount">
            <div class="value monospace">{{ amount }}</div>
            <div class="symbol">{{ asset.symbol }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { trimmedLocaleString } from '@/helper'
import AddressLink from '@/components/rows/TxRow/AddressLink.vue'
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import Big from 'big.js'

@Component({
    components: {
        AddressLink,
    },
})
export default class OutputUtxo extends Vue {
    @Prop() output!: Output

    get asset(): Asset {
        if (this.$store.state.assets[this.output.assetID]) {
            return this.$store.state.assets[this.output.assetID]
        }
        this.$store.dispatch('addUnknownAsset', this.output.assetID)
        //@ts-ignore
        return {
            id: '',
            alias: '',
            chainID: '',
            currentSupply: Big(0),
            denomination: 0,
            name: '',
            symbol: '',
            profane: false,
        }
    }

    get addresses(): string[] {
        return this.output.addresses
    }

    get amount(): string {
        const amt = Big(this.output.amount)
        return trimmedLocaleString(amt, this.asset.denomination)
    }
}
</script>
<style scoped lang="scss"></style>
