<template>
    <div class="tx_table" v-if="transactions">
        <transition-group name="fade">
            <tx-row
                v-for="tx in tx_page"
                class="tx_item"
                :key="tx.id"
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
    data() {
        return {
            pageNow: 0,
            from: 0,
            to: PAGINATION,
            pagination: PAGINATION,
        }
    },
    props: {
        transactions: Array,
    },
    computed: {
        tx_page() {
            let start = this.pageNow * PAGINATION
            let end = start + PAGINATION
            return this.transactions.slice(start, end)
        },
        pageNum() {
            return Math.ceil(this.transactions.length / PAGINATION)
        },
    },
    methods: {
        setPage(num) {
            let start = num * PAGINATION
            let end = start + PAGINATION

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
