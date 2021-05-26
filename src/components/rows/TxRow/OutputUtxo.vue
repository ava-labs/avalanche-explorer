<template>
    <div
        class="to"
        :style="{
            backgroundColor: background,
        }"
    >
        <div class="addresses">
            <div v-for="(addr, i) in addresses" :key="i" class="addr_container">
                <span v-if="$vuetify.breakpoint.smAndDown" class="label"
                    >To</span
                >
                <AddressLink :address="addr.displayAddress" />
            </div>
        </div>
        <div class="amount">
            <div v-if="!isNFT" class="value monospace">
                {{ amount }}<span class="leftover">{{ leftover }}</span>
            </div>
            <div class="symbol">
                <router-link :to="`/asset/${asset.id}`">{{
                    asset.symbol
                }}</router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { trimmedLocaleString, backgroundColor } from '@/helper'
import AddressLink from '@/components/rows/TxRow/AddressLink.vue'
import { Asset } from '@/js/Asset'
import Big from 'big.js'
import { DisplayAddress } from '@/js/Transaction'

@Component({
    components: {
        AddressLink,
    },
})
export default class OutputUtxo extends Vue {
    @Prop() output!: any

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

    get addresses(): DisplayAddress[] {
        return this.output.addresses
    }

    get amount(): string {
        const amt = Big(this.output.amount)
        return trimmedLocaleString(amt, this.asset.denomination)
    }

    get leftover(): string {
        const charsAfterPeriod = this.amount.split('.')[1]

        // PAD WITH PERIOD AND ZEROS
        if (!charsAfterPeriod) {
            const paddingZeros = this.asset.denomination
            let leftover = '.'
            for (let i = 0; i < paddingZeros; i++) {
                leftover += '0'
            }
            return leftover
        }
        // NO NEED TO PAD WITH ZEROS
        const paddingZeros = this.asset.denomination - charsAfterPeriod.length
        if (!paddingZeros) {
            return ''
        }
        // PAD WITH ZEROS
        let leftover = ''
        for (let i = 0; i < paddingZeros; i++) {
            leftover += '0'
        }
        return leftover
    }

    get isNFT(): boolean {
        switch (this.output.outputType) {
            case 7:
                return false
            case 10:
                return true
            case 11:
                return true
            default:
                return false
        }
    }

    get background(): string {
        return backgroundColor(this.addresses[0].displayAddress!)
    }
}
</script>
<style scoped lang="scss"></style>
