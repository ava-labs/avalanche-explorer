<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="loading && !requestError">
            <Loader :contentId="addressID" :message="'Fetching Address Details'"></Loader>
        </template>
        <template v-if="!loading && requestError">
            <div class="card address_details_error">
                <h2>There was an error fetching address details.</h2>
                <p>Status {{requestErrorStatus}} - {{requestErrorMessage}}</p>
                <p><a href="https://github.com/ava-labs/avalanche-explorer/issues" target="_blank">Submit Issue</a></p>
            </div>
        </template>
        <section class="card meta" v-if="this.metaData && !requestError">
            <header class="header">
                <h2>X-{{addressID}}</h2>
            </header>
            <article class="meta_row">
                <p class="label">Address</p>
                <p class="addr">
                    <span>X-{{addressID}}</span>
                    <span class="alias" v-if="alias">{{alias}}</span>
                </p>
            </article>
            <article class="meta_row">
                <p class="label">AVAX Balance</p>
                <p>{{avaxBalance.toLocaleString(this.assetsMap["nznftJBicce1PfWQeNEVBmDyweZZ6zcM3p78z9Hy9Hhdhfaxm"].denomination)}} AVAX</p>
            </article>
            <article class="meta_row">
                <p class="label">Transactions</p>
                <p>{{totalTransactionCount.toLocaleString()}}</p>
            </article>
            <article class="meta_row">
                <p class="label">Portfolio</p>
                <BalanceTable :assets="assets"></BalanceTable>
            </article>
        </section>
        <section v-if="!loading && !txRequestError" class="card transactions">
            <header class="header">
                <h2>Transactions</h2>
                <template v-if="txloading && !assetsLoaded">
                    <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
                </template>
                <template v-else>
                    <div class="bar">
                        <p class="count">
                            <template v-if="!requestError">{{totalTransactionCount.toLocaleString()}} transactions found</template>
                        </p>
                        <div class="pagination-container">
                            <pagination-controls
                                :total="totalTransactionCount"
                                :limit="limit"
                                @change="page_change"
                                ref="paginationTop"
                            ></pagination-controls>
                        </div>
                    </div>
                </template>
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
            <div v-show="txloading">
                <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
            </div>
            <div v-show="!txloading">
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
                <div class="bar-table">
                    <pagination-controls 
                        :total="totalTransactionCount" 
                        :limit="limit" 
                        @change="page_change" 
                        ref="paginationBottom">
                    </pagination-controls>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import Tooltip from "../components/rows/Tooltip.vue";
import BalanceTable from "../components/Address/BalanceTable.vue";
import BalanceRow from "../components/Address/BalanceRow.vue";
import TxRow from "../components/rows/TxRow/TxRow.vue";
import PaginationControls from "../components/misc/PaginationControls.vue";
import api from "../axios";
import Big from "big.js";
import { stringToBig, blockchainMap, trimmedLocaleString } from "@/helper";
import AddressDict from "@/known_addresses";
import Address from "@/js/Address";
import { Transaction } from '@/js/Transaction';

@Component({
    components: {
        Loader,
        Tooltip,
        BalanceTable,
        TxRow,
        PaginationControls
    },
    filters: {
        pluralize(val: number) {
            return val === 0
                ? `${val} assets`
                : val > 1
                ? `${val} assets`
                : `${val} asset`;
        },
    },
})
export default class AddressPage extends Vue {
    loading: boolean = false;
    requestError: boolean = false;
    requestErrorStatus: number | null = null;
    requestErrorMessage: string | null = null;
    txloading: boolean = false;
    txRequestError: boolean = false;
    metaData: Address | null = null;
    transactions: Transaction[] = [];
    totalTx: number = 0;
    limit: number = 25; // how many to display
    offset: number = 0;
    sort: string = "timestamp-desc";
    breadcrumbs: any[] = [
        {
            text: "Home",
            disabled: false,
            href: "/"
        },
        {
            text: "Address",
            disabled: true,
            href: ""
        }
    ];

    created() {
        this.updateData();
    }
    
    @Watch("address")
    onAddressChanged(val: string) {
        this.updateData();
    }

    @Watch("assetsLoaded")
    onAssetsLoaded() {
        this.updateData();
    }
    @Watch("$route")
    onRouteChanged(val: string) {
        this.updateData();
    }
    
    get assetsLoaded() {
        return this.$store.state.assetsLoaded;
    }

    get alias() {
        return AddressDict[this.addressID] ? AddressDict[this.addressID] : "";
    }

    get assets() {
        return (this.metaData) ? this.metaData.assets : [];
    }
    
    get assetsMap() {
        return this.$store.state.assets;
    }
    
    get addressID() {
        let address = this.$route.params.address;
        if (address.indexOf("-") === 1) {
            address = address.substring(2, address.length);
        }
        return address;
    }
    
    get txCount() {
        return (this.metaData) ? this.metaData.totalTransactionCount : 0;
    }

    get avaxBalance() {
        return (this.metaData) ? this.metaData.avaxBalance : Big(0);
    }

    get totalTransactionCount() {
        return (this.metaData) ? this.metaData.totalTransactionCount : 0;
    }
    
    get totalUtxoCount() {
        return (this.metaData) ? this.metaData.totalUtxoCount : 0;
    }
    
    updateData() {
        this.loading = true;
        this.txloading = true;

        if (this.assetsLoaded) {
            this.getTx();
            this.getAddressDetails();
        }
    }

    getTx() {
        this.txloading = true;

        // Get txs by address
        // TODO: support service for multiple chains
        let url = `/x/transactions?address=${this.addressID}&sort=${this.sort}&offset=${this.offset}&limit=${this.limit}`;

        api.get(url).then(res => {
            this.txloading = false;
            this.transactions = res.data.transactions;
        })
        .catch(err => {
            this.txloading = false;
            if (err.response) {
                console.log(err.response);
                this.txRequestError = true;
            }
        });
    }

    getAddressDetails() {
        // TODO: support service for multiple chains
        let url = `/x/addresses/${this.addressID}`;
        api.get(url).then(res => {
            this.loading = false;
            this.metaData = new Address(res.data, this.assetsMap);
        })
        .catch(err => {
            this.loading = false;
            if (err.response) {
                console.log(err.response);
                this.requestError = true;
                this.requestErrorStatus = err.response.status;
                this.requestErrorMessage = err.response.data.message;
            } else if (err.request) {
                console.log(err.request);
            }
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

/* ==========================================
   details
   ========================================== */

.addr {
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;

    .alias {
        background-color: #e6ffe6;
        border: 1px solid main.$green;
        color: main.$green;
        width: max-content;
        padding: 4px 8px;
        margin: 0px 30px;
    }
}

.address_details_error  {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    text-align: center;

    a {

    
    display: block;
    width: max-content;
    text-decoration: none !important;
    margin-top: 30px;
    transition: opacity 0.3s;
    
    background-color: transparent !important;
    color: main.$secondary-color !important;
    padding: 10px 24px;

    border-radius: 6px;
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase!important;
    font-size: 14px;


    &:hover {
        opacity: 0.9;
    }

    }
}

/* ==========================================
   transactions
   ========================================== */

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.transactions {
    overflow: auto;
    margin-top: 30px;

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
    .bar {
        flex-direction: column;
        align-items: stretch;

        .pagination-container {
            padding-top: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

    }

    .bar-table {
        justify-content: center;
    }

    .transactions {
        .table_headers {
            display: none;
        }
    }
}
</style>
