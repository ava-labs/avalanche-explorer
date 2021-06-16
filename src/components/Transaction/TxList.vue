<template>
    <div>
        <TxTableHead />
        <v-alert v-if="transactions.length === 0" color="#e6f5ff" dense>
            There are no matching entries
        </v-alert>
        <div class="rows">
            <transition-group name="fade" mode="out-in">
                <TxRow
                    v-for="tx in transactions"
                    :key="tx.id"
                    class="tx_item"
                    :transaction="tx"
                />
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TxTableHead from '@/components/rows/TxRow/TxTableHead.vue'
import TxRow from '@/components/rows/TxRow/TxRow.vue'
import { Transaction } from '@/js/Transaction'

@Component({
    components: {
        TxTableHead,
        TxRow,
    },
})
export default class TxInteractive extends Vue {
    @Prop() transactions!: Transaction[]
}
</script>

<style scoped lang="scss">
.tx_item {
    border-bottom: 1px solid #e7e7e7;

    &:last-of-type {
        border: none !important;
    }
}

@include smOnly {
    .table_headers {
        display: none;
    }
}
</style>
