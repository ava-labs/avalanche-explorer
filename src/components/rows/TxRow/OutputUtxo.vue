<template>
    <div class="to_amount">
        <div>
            <div v-for="(addr, i) in addresses" :key="i" class="to">
                <span v-if="$vuetify.breakpoint.smAndDown" class="label"
                    >To</span
                >
                <router-link
                    class="addr monospace"
                    :to="`/address/X-` + addr.address"
                    >{{ addr.displayAddress }}</router-link
                >
            </div>
        </div>
        <div class="info_col" style="padding-right: 0">
            <div class="amount_col to">
                <p class="amount">
                    {{ amount }}
                    <span>{{ asset.symbol }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { trimmedLocaleString } from '@/helper'
import { Output } from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import Big from 'big.js'

@Component({
    filters: {},
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

<style scoped lang="scss">
.to_amount {
    display: grid;
    grid-template-columns: 1fr max-content;
}

.to {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    white-space: nowrap;
    overflow: hidden;
}

.amount_col {
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
}
</style>
