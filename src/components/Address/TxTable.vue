<template>
    <div v-if="transactions" class="tx_table">
        <transition-group name="fade">
            <tx-row
                v-for="tx in tx_page"
                :key="tx.id"
                class="tx_item"
                :transaction="tx"
            ></tx-row>
        </transition-group>
    </div>
</template>

<script>
import TxRow from '../rows/TxRow/TxRow'

const PAGINATION = 25
export default {
    components: {
        TxRow,
    },
    props: {
        transactions: Array,
    },
    data() {
        return {
            pageNow: 0,
            from: 0,
            to: PAGINATION,
            pagination: PAGINATION,
        }
    },
    computed: {
        tx_page() {
            const start = this.pageNow * PAGINATION
            const end = start + PAGINATION
            return this.transactions.slice(start, end)
        },
        pageNum() {
            return Math.ceil(this.transactions.length / PAGINATION)
        },
    },
    methods: {
        setPage(num) {
            const start = num * PAGINATION
            const end = start + PAGINATION

            this.from = start
            this.to = end
            this.pageNow = num
        },
    },
}
</script>

<style scoped lang="scss">
.tx_item {
    border-bottom: 1px solid #e7e7e7;

    &:last-of-type {
        border: none !important;
    }
}
</style>
