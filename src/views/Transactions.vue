<template>
    <div class="transactions">
        <div class="card">
            <div class="header">
                <h2>All Transactions</h2>
                <div class="bar">
                    <p class="count">{{totalTx}} transactions found</p>
                    <pagination-controls :total="totalTx" :limit="limit" @change="page_change"></pagination-controls>
                </div>
            </div>
            <div class="table_headers all_tx_rows">
                <p></p>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p v-on="on">ID</p>
                    </template>
                    <span>A transaction queries or modifies the state of a blockchain.</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p v-on="on">From</p>
                    </template>
                    <span>Address that sends transfer value</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p v-on="on">To</p>
                    </template>
                    <span>Address that receives transfer value</span>
                </v-tooltip>
            </div>
            <div class="rows">
                <!--<transition-group name="fade">-->
                <tx-row class="tx_item" v-for="tx in transactions" :transaction="tx" :key="tx.id"></tx-row>
                <!--</transition-group>-->
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/axios";
import TxRow from "../components/rows/TxRow/TxRow";
import PaginationControls from "../components/misc/PaginationControls";

export default {
    components: {
        TxRow,
        PaginationControls
    },
    data() {
        return {
            totalTx: 0,
            limit: 25, // how many to display
            offset: 0,
            txs: []
        };
    },
    created() {
        this.getTx();
    },
    methods: {
        page_change(val) {
            this.offset = val;
            this.getTx();
        },
        getTx() {
            let parent = this;
            let sort = "timestamp-desc";
            let url = `/x/transactions?sort=${sort}&offset=${this.offset}&limit=${this.limit}`;
            api.get(url).then(res => {
                const data = res.data.transactions;
                parent.txs = data;
                parent.totalTx = res.data.count;
                console.log(res.data);
            });
        }
    },
    computed: {
        transactions() {
            let res = this.txs;
            return res;
        }
    }
};
</script>
<style scoped lang="scss">
@use '../main';

.transactions {
    font-size: 12px;
}

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;

    .count {
        color: #808080;
    }
}

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.table_headers {
    display: grid;
    grid-template-columns: 35px 120px 1fr 1fr;
    padding-bottom: 7px;
    border-bottom: 1px solid #e7e7e7;

    p {
        padding: 0px 10px;
        font-weight: bold;
    }
}

.all_tx_rows {
    width: 100%;
    font-size: 12px;
    border-radius: 2px;
    margin-bottom: 2px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
}

.tx_item {
    border-bottom: 1px solid #e7e7e7;

    &:last-of-type {
        border: none !important;
    }
}

@media only screen and (max-width: main.$mobile_width) {
    .table_headers {
        display: none;
    }
}
</style>
