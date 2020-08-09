<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Metadata :asset="asset"></Metadata>
        <section v-if="!txloading" class="card transactions">
            <header class="header">
                <h2>Recent Transactions</h2>
                <template v-if="txloading && !assetsLoaded">
                    <v-progress-circular :size="16" :width="2" color="#976cfa" indeterminate key="1" ref="paginationTop"></v-progress-circular>
                </template>
                <!-- <template v-else>
                    <div class="bar">
                        <p
                            class="count"
                        >{{totalTransactionCount.toLocaleString()}} transactions found</p>
                        <pagination-controls
                            :total="totalTransactionCount"
                            :limit="limit"
                            @change="page_change"
                        ></pagination-controls>
                    </div>
                </template> -->
            </header>
            <div class="table_headers tx_rows">
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
            <template v-if="txloading">
                <v-progress-circular :size="16" :width="2" color="#976cfa" indeterminate key="1"></v-progress-circular>
            </template>
            <template v-else>
                <div class="rows">
                    <transition-group name="fade">
                    <tx-row
                        class="tx_item"
                        v-for="tx in transactions"
                        :transaction="tx"
                        :key="tx.id"
                    ></tx-row>
                    </transition-group>
                </div>
                <!-- <div class="bar-table">
                    <pagination-controls :total="totalTransactionCount" :limit="limit" @change="page_change" ref="paginationBottom"></pagination-controls>
                </div> -->
            </template>
        </section>
        <template v-if="!genesisTx">
            <Loader :contentId="assetID" :message="'Fetching Asset Details'"></Loader>
        </template>
        <template v-else>
            <TransactionDetailCard :tx="genesisTx">Asset Genesis Details</TransactionDetailCard>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import Metadata from "../components/Asset/Metadata.vue";
import TransactionDetailCard from "../components/TransactionDetailCard.vue";
import PaginationControls from "../components/misc/PaginationControls.vue";
import Tooltip from "../components/rows/Tooltip.vue";
import TxRow from "../components/rows/TxRow/TxRow.vue";
import { Transaction } from "../js/Transaction";
import { Asset } from "@/js/Asset";
import api from "../axios";

@Component({
    components: {
        Loader,
        Metadata,
        PaginationControls,
        TransactionDetailCard, 
        Tooltip,
        TxRow
    }
})
export default class AssetPage extends Vue {
    genesisTx: Transaction | null = null;
    txloading: boolean = false;
    totalTx: number = 0;
    limit: number = 10; // how many to display
    offset: number = 0;
    sort: string = "timestamp-desc";
    transactions: Transaction[] = [];

    created() {
        this.getData();
    }

    @Watch("txId")
    ontxIdChanged(val: string, oldVal: string) {
        this.getData();
    }

    @Watch("assetsLoaded")
    onAssetsLoaded() {
        this.getData();
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded;
    }

    get breadcrumbs(): any[] {
        return [
            {
                text: "Home",
                disabled: false,
                href: "/"
            },
            {
                text: "Assets",
                disabled: false,
                href: "/assets"
            },
            {
                text: `${
                    this.asset
                        ? this.asset.symbol
                            ? this.asset.symbol
                            : this.asset.id
                        : "Asset"
                }`,
                disabled: true,
                href: ""
            }
        ];
    }

    get assetID(): string {
        return this.$route.params.id;
    }

    get asset(): Asset {
        return this.$store.state.assets[this.$route.params.id];
    }

    get txId(): string {
        return this.$route.params.id;
    }

    getData():void  {
        let parent = this;
        this.txloading = true;
        
        if (this.assetsLoaded) { 
            // Get genesis tx
            let url = `/x/transactions/${this.txId}`;
            api.get(url)
                .then(res => {
                    const data = res.data;
                    let tx = new Transaction(data);
                    parent.genesisTx = tx;
                })
                .catch(err => {
                    console.log(err);
                });

                // Get txs
                // TODO: support service for multiple chains
                url = `/x/transactions?assetID=${this.assetID}&sort=${this.sort}&offset=${this.offset}&limit=${this.limit}`;
                api.get(url).then(res => {
                    parent.txloading = false;
                    parent.transactions = res.data.transactions;
                });
        }


    }

    getTx() {
        let parent = this;
        parent.txloading = true;

        // Get txs by address
        // TODO: support service for multiple chains
        let url = `/x/transactions?assetID=${this.assetID}&sort=${this.sort}&offset=${this.offset}&limit=${this.limit}`;

        api.get(url).then(res => {
            parent.txloading = false;
            parent.transactions = res.data.transactions;
        });
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
}
</script>

<style scoped lang="scss">
@use "../main";

$symbol_w: 35px;

.symbol {
    margin-left: 20px;
    text-align: center;
    line-height: $symbol_w;
    background-color: #f1f2f3;
    color: #000;
    font-size: 14px;
    font-weight: 400; /* 700 */
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.asset_genesis {
    margin-top: 30px;
}

@include main.device_xs {
    .asset_genesis {
        margin-top: 10px;
    }   
}

/* ==========================================
   transactions
   ========================================== */

.transactions {
    overflow: auto;
    margin-top: 30px;
    margin-bottom: 30px;

    .table_headers {
        display: grid;
        grid-template-columns: 35px 120px 1fr 1fr;
        padding-bottom: 7px;
        border-bottom: 1px solid #e7e7e7;

        p {
            padding: 0px 10px;
            font-weight: 400; /* 700 */
            font-size: 12px;
        }
    }

    .tx_rows {
        width: 100%;
        border-radius: 2px;
        margin: 2px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
    }

    .tx_table {
        font-size: 12px;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

@include main.device_s {
    .transactions {
        margin-bottom: 10px;
        
        .table_headers {
            display: none;
        }
    }
}
</style>