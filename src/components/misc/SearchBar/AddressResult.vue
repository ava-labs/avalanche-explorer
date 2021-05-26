<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">Address</p>
        </div>
        <div class="data">
            <p class="result_id">{{ prefixedAddress }}</p>
            <p class="balance">
                Balance
                <span
                    >{{ avaxBalance.toLocaleString(avaxDenomination) }}
                    {{ avaxSymbol }}</span
                >
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { stringToBig } from '@/helper'
import { AVAX_ID } from '@/known_assets'

@Component({})
export default class AddressResult extends Vue {
    @Prop() item!: any | null

    select() {
        // TODO: support for multiple chains. add a chain param
        const url = `/address/X-${this.item.address}`
        this.$router.push(url)
        this.$emit('select')
    }

    get avaxBalance() {
        return stringToBig(
            this.item.assets[AVAX_ID].balance,
            this.avaxDenomination
        )
    }

    get avaxDenomination() {
        return this.$store.state.assets[AVAX_ID].denomination
    }

    get avaxSymbol() {
        return this.$store.state.assets[AVAX_ID].symbol
    }

    get numTx() {
        return this.item.transactionCount
    }

    get chainNow() {
        return this.$store.state.chainId
    }

    get prefixedAddress() {
        return `${this.chainNow}-${this.item.address}`
    }
}
</script>
<style scoped lang="scss">
.symbol_container {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

$symbol_W: 40px;

.symbol {
    padding: 0;
    border-radius: 6px;
    font-weight: 500;
    font-size: 9px;
    height: $symbol_W;
    width: $symbol_W;
    text-align: center;
    line-height: $symbol_W;
}

.result_id {
    color: $primary-color;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
}

.balance {
    padding-top: 4px;
    opacity: 0.7;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
}
</style>
