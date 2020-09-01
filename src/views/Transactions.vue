<template>
    <div class="transactions">
        <div class="card">
            <div class="header">
                <h2>Transactions</h2>
                <template v-show="!loading && assetsLoaded">
                    <div class="bar">
                        <p class="count">{{totalTx.toLocaleString()}} transactions found</p>
                        <pagination-controls :total="totalTx" :limit="limit" @change="page_change" ref="paginationTop" v-show="assetsLoaded"></pagination-controls>
                    </div>    
                </template>
            </div>
            <template v-if="loading && !assetsLoaded">
                <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
            </template>
            <template v-else>
                <div class="table_headers all_tx_rows">
                    <p></p>
                    <p>
                        ID
                        <Tooltip content="a transaction queries or modifies the state of a blockchain"></Tooltip>
                    </p>
                    <p>
                        From
                        <Tooltip content="address that sends transfer value"></Tooltip>
                    </p>
                    <p>
                        To
                        <Tooltip content="address that receives transfer value"></Tooltip>
                    </p>
                </div>
                <div class="rows">
                    <transition-group name="fade" mode="out-in">
                    <tx-row
                        class="tx_item"
                        v-for="tx in transactions"
                        :transaction="tx"
                        :key="tx.id"
                    ></tx-row>
                    </transition-group>
                </div>
                <div class="bar-table">
                    <pagination-controls :total="totalTx" :limit="limit" @change="page_change" ref="paginationBottom"></pagination-controls>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import api from "@/axios";
import Tooltip from "../components/rows/Tooltip.vue";
import TxRow from "../components/rows/TxRow/TxRow.vue";
import PaginationControls from "../components/misc/PaginationControls.vue";
import { Transaction } from '@/js/Transaction';

@Component({
    components: {
        Tooltip,
        TxRow,
        PaginationControls
    },
})

export default class Transactions extends Vue {
    loading: boolean = true;
    totalTx: number = 0;
    limit: number = 25; // how many to display
    offset: number = 0;
    txs: Transaction[] = [];

    created() {
        this.getTx();
    }

    get transactions() {
        return this.txs;
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded;
    }

    @Watch("assetsLoaded")
    onAssetsLoadedChanged(val: string, oldVal: string) {
        this.getTx();
    }

    page_change(val: number) {
        this.offset = val;
        this.getTx();
        let pgNum = Math.floor(this.offset / this.limit) + 1;
        // @ts-ignore
        this.$refs.paginationTop.setPage(pgNum); 
        // @ts-ignore
        this.$refs.paginationBottom.setPage(pgNum); 
    }


    getTx(): void {
        let parent = this;
        parent.loading = true;
        let sort = "timestamp-desc";
        // TODO: support service for multiple chains
        let url = `/x/transactions?sort=${sort}&offset=${this.offset}&limit=${this.limit}`;
        
        if (this.assetsLoaded) {
            api.get(url).then(res => {
                parent.txs = res.data.transactions;
                parent.totalTx = res.data.count;
                parent.loading = false;
            });
        }
    }
}
</script>

<style scoped lang="scss">
@use "../main";

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
    grid-template-columns: 40px .62fr 1.2fr 1.2fr;
    font-size: 12px;    
    margin-bottom: 2px;
    padding-bottom: 7px;
    border-bottom: 1px solid #e7e7e7;
    box-sizing: border-box;

    p {
        padding: 0px 10px;
        font-weight: 400; /* 700 */
        font-size: 16px;
    }
}

.tx_item {
    border-bottom: 1px solid #e7e7e7;

    &:last-of-type {
        border: none !important;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

@include main.device_s {
    .table_headers {
        display: none;
    }
}
</style>
