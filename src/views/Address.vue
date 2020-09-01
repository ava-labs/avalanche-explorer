<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Loader v-if="loading && !requestError" :contentId="addressID" :message="'Fetching Address Details'"></Loader>
        <!-- Address Details -->
        <div v-if="!loading && requestError" class="card address_details_error">
            <h2>There was an error fetching address details.</h2>
            <p>Status {{requestErrorStatus}} - {{requestErrorMessage}}</p>
            <p><a href="https://github.com/ava-labs/avalanche-explorer/issues" target="_blank">Submit Issue</a></p>
        </div>
        <Metadata v-if="metaData && !requestError && assetsLoaded === true" 
            :metaData="metaData"
            :addressID="addressID"
            :alias="alias"
            :totalTransactionCount="totalTransactionCount"
            :totalUtxoCount="totalUtxoCount"
            :assets="assets"
        ></Metadata>
        <!-- Address Txs -->
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
                <v-alert
                    v-if="transactions.length === 0"
                    color="#e6f5ff"
                    dense
                >
                    There are no matching entries
                </v-alert>
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
import Metadata from "../components/Address/Metadata.vue";
import TxRow from "../components/rows/TxRow/TxRow.vue";
import PaginationControls from "../components/misc/PaginationControls.vue";
import api from "../axios";
import Big from "big.js";
import { stringToBig, blockchainMap, trimmedLocaleString } from "@/helper";
import AddressDict from "@/known_addresses";
import Address from "@/js/Address";
import { Transaction } from '@/js/Transaction';
import { IBalance, IAddress, IAddressData } from '@/js/IAddress';

@Component({
    components: {
        Loader,
        Tooltip,
        Metadata,
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
    // navigation
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
    // details
    loading: boolean = false;
    requestError: boolean = false;
    requestErrorStatus: number | null = null;
    requestErrorMessage: string | null = null;
    metaData: Address | null = null;
    // txs
    txloading: boolean = false;
    txRequestError: boolean = false;
    transactions: Transaction[] = [];
    // tx pagination
    totalTx: number = 0;
    limit: number = 25; // how many to display
    offset: number = 0;
    sort: string = "timestamp-desc";

    created() {
        this.updateData();
    }
    
    @Watch("address")
    onAddressChanged(val: string) {
        this.updateData();
    }

    @Watch("assetsLoaded")
    onAssetsLoaded(val: boolean) {
        this.updateData();
    }
    
    @Watch("$route")
    onRouteChanged(val: string) {
        this.updateData();
    }
    
    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded;
    }

    get alias(): string {
        return AddressDict[this.addressID] ? AddressDict[this.addressID] : "";
    }

    get assets(): IBalance[] {
        return (this.metaData) ? this.metaData.assets : [];
    }
    
    get assetsMap(): any {
        return this.$store.state.assets;
    }
    
    get addressID(): string {
        let address = this.$route.params.address;
        if (address.indexOf("-") === 1) {
            address = address.substring(2, address.length);
        }
        return address;
    }
    
    get txCount(): number {
        return (this.metaData) ? this.metaData.totalTransactionCount : 0;
    }

    get totalTransactionCount():  number {
        return (this.metaData) ? this.metaData.totalTransactionCount : 0;
    }
    
    get totalUtxoCount(): number {
        return (this.metaData) ? this.metaData.totalUtxoCount : 0;
    }
    
    // get address details and txs
    updateData() {
        this.loading = true;
        this.txloading = true;

        if (this.assetsLoaded) {
            this.getTx();
            this.getAddressDetails();
        }
    }

    getAddressDetails() {
        // TODO: support service for multiple chains
        if (this.assetsLoaded === true) {
            let url = `/x/addresses/${this.addressID}`;
            api.get(url).then(res => {
                this.loading = false;
                
                if (res.data) {
                    // address in Ortelius
                    this.metaData = new Address(res.data, this.assetsMap);
                } else {
                    // not in Ortelius
                    let nullData: IAddressData = {
                        address: this.addressID,
                        publicKey: "",
                        assets: {},
                    };
                    this.metaData = new Address(nullData, this.assetsMap);
                }
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

.address_details_error {
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

    .v-alert {
        margin: 16px;
        padding: 16px;
        color: main.$blue;
        font-size: 14px;
    }
}

.bar-table {
    border-top: 1px solid #e7e7e7;
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
