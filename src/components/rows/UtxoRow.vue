<template>
    <div class="utxo_row">
        <div>UTXO</div>
        <div>
            <p class="label">Amount</p>
            <p>{{ amount.toFixed(2) }} {{ asset.symbol }}</p>
        </div>
        <div>
            <p class="label">Tx</p>
            <router-link :to="`/tx/${txId}`">{{ txId }}</router-link>
        </div>
    </div>
</template>
<script>
import { stringToBig } from '../../helper'

export default {
    props: {
        utxo: {
            type: Object,
            required: true,
        },
    },
    computed: {
        addresses() {
            return this.utxo.addresses
        },
        amount() {
            const val = stringToBig(this.utxo.amount, this.asset.denomination)
            return val
        },
        asset() {
            const id = this.utxo.assetID
            return this.$store.state.assets[id]
        },
        txId() {
            return this.utxo.transactionID
        },
    },
}
</script>
<style scoped lang="scss">
.utxo_row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>
