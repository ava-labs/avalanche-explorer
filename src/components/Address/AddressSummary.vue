<template>
    <section class="card">
        <header class="header">
            <h2 v-if="alias">{{ alias }}</h2>
            <h2 v-else>{{ addressID }}</h2>
        </header>
        <Metadata
            :meta-data="metaData"
            :address-i-d="addressID"
            :alias="alias"
            :total-transaction-count="totalTransactionCount"
            :total-utxo-count="totalUtxoCount"
            :assets="assets"
            :prefix="prefix"
        />
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IAddress, IBalanceX } from '@/services/addresses/models'
import Metadata from '@/components/Address/Metadata.vue'

@Component({
    components: {
        Metadata,
    },
})
export default class AddressSummary extends Vue {
    @Prop() metaData!: IAddress
    @Prop() addressID!: string
    @Prop() alias!: string
    @Prop() totalTransactionCount!: number
    @Prop() totalUtxoCount!: number
    @Prop() assets!: IBalanceX[]
    @Prop() prefix!: string
}
</script>

<style scoped lang="scss">
.addr {
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;

    .alias {
        background-color: #e6ffe6;
        border: 1px solid $green;
        color: $green;
        width: max-content;
        padding: 4px 8px;
        margin: 0px 30px;
    }
}
</style>
