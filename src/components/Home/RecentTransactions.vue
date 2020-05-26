<template>
    <div class="recent_tx">
        <div class="header">
            <h2>Latest Transactions</h2>
            <v-btn :loading="isAjax" :text="true" @click="updateTx" class="refresh">
                <fa icon="sync"></fa> <span class="ava-btn-label">Refresh</span>
            </v-btn>
            <p class="chain">
                You are viewing transactions for
                <span>AVA X-Chain</span>
            </p>
        </div>
        <div class="list">
            <div class="table_headers recent_tx_rows">
                <p></p>
                <p>ID</p>
                <p>From</p>
                <p>To</p>
            </div>
            <transition-group name="fade">
                <tx-row
                    v-for="tx in transactions"
                    :key="tx.id"
                    class="recent_tx_rows"
                    :transaction="tx"
                ></tx-row>
            </transition-group>
        </div>
        <div class="bottom">
            <router-link to="/tx" class="view_all">View All transactions</router-link>
        </div>
    </div>
</template>
<script>
import api from "@/axios";
import Vue from "vue";

import TxRow from "@/components/rows/TxRow/TxRow";

export default Vue.extend({
    components: {
        TxRow
    },
    data() {
        return {
            isAjax: false,
            // all_tx: [],
            transactions: []
        };
    },
    created() {
        this.updateTx();
    },
    methods: {
        updateTx() {
            const parent = this;
            let txNum = 8;
            this.isAjax = true;
            api.get(`/x/transactions?sort=timestamp-desc&limit=${txNum}`).then(
                res => {
                    const list = res.data.transactions;
                    parent.transactions = list;
                    parent.isAjax = false;
                }
            );
        }
    }
});
</script>
<style scoped lang="scss">
@use '../../main';

.refresh {
    margin-left: 16px;
}

.ava-btn-label {
    padding-left: 8px;
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

.chain {
    font-size: 12px;
    color: #929ba6;
    font-weight: lighter;
    text-align: right;
    flex-grow: 1;

    span {
        padding: 4px 12px;
        border-radius: 4px;
        color: #976cfa;
        background-color: #ebe4fb;
        line-height: 2em;
        word-break: keep-all;
        white-space: nowrap;
    }
}
.col_1 {
    padding: 0px 30px;
}

.list {
    padding: 0px 30px;
}

.header {
    display: flex;
    padding: 15px 30px;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 10px;

    h2 {
        margin: 0;
        font-size: 18px;
    }
}

.refresh {
    font-size: 12px;
    text-transform: none;
    border: none;
    opacity: 0.5;
}

.recent_tx_rows {
    width: 100%;
    font-size: 12px;
    border-radius: 2px;
    margin-bottom: 2px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
}

.bottom {
    display: flex;
    flex-flow: row-reverse;
}

.view_all {
    display: block;
    width: max-content;
    text-decoration: none !important;
    margin: 30px;
    background-color: #71c5ff;
    color: #fff !important;
    padding: 12px 24px;
    font-size: 12px;
    border-radius: 4px;
}

@media only screen and (max-width: main.$mobile_width) {
    .view_all {
        width: 100%;
        text-align: center;
    }

    .table_headers {
        display: none;
    }

    .header {
        padding: 15px;
    }
    .list {
        padding: 0;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}
</style>
