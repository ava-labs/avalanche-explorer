<template>
    <TransactionResult
        v-if="type === `transaction`"
        class="search_result"
        :item="result.data"
    />
    <AddressResult
        v-else-if="type === `address`"
        class="search_result"
        :item="result.data"
    />
    <AssetResult
        v-else-if="type === `asset`"
        class="search_result"
        :item="result.data"
    />
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TransactionResult from '@/components/misc/SearchBar/TransactionResult.vue'
import AddressResult from '@/components/misc/SearchBar/AddressResult.vue'
import AssetResult from '@/components/misc/SearchBar/AssetResult.vue'
import { Transaction } from '@/js/Transaction'

@Component({
    components: {
        TransactionResult,
        AddressResult,
        AssetResult,
    },
})
export default class ResultRow extends Vue {
    tx: Transaction | null = null
    @Prop() result!: any

    created() {
        if (this.type === 'transaction') {
            this.tx = new Transaction(this.result.data)
        }
    }

    get type() {
        return this.result.type
    }
}
</script>

<style scoped lang="scss">
.search_result {
    position: static;
    z-index: 999;
}

.search_result:hover {
    opacity: 0.7;
}
</style>
