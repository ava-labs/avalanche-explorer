<template>
    <div class="addresses">
        <div class="card">
            <div class="header">
                <h2>Addresses</h2>
                <template v-show="!loading && addressesLoaded">
                    <div class="bar">
                        <p class="count">{{totalAddresses.toLocaleString()}} addresses found</p>
                    </div>    
                </template>
            </div>
            <template v-if="loading && !addressesLoaded">
                <v-progress-circular :size="16" :width="2" color="#976cfa" indeterminate key="1"></v-progress-circular>
            </template>
            <template v-else>
                <AddressDataTable :addresses="addressesList" :links="true"></AddressDataTable>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import api from "@/axios";
import { IAddressState } from "@/store/modules/address/IAddressState";
import { IAddress, IAddressData, IBalance } from '@/js/IAddress';
import { AVALANCHE_SUBNET_ID } from '../store/modules/platform/platform';
import AddressDataTable from '@/components/Address/AddressDataTable.vue';
import { stringToBig } from '../helper';
import Big from "big.js";

@Component({
    components: {
        AddressDataTable
    },
})

export default class Addresses extends Vue {
    loading: boolean = true;
    addressesList: IAddress[] = [];

    async created() {
        this.loading = false;
        api.get("/x/addresses").then(res => {
            let addresses: IAddressData[] = res.data.addresses;
            console.log("addresses", addresses);
            let addressesMap: {[key:string]: IAddressData} = {};
            addresses.forEach((addressData: IAddressData) => {
                // if have AVAX
                for (const asset in addressData.assets) {
                    if (asset === "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA") {
                        console.log("I hold AVAX:", addressData.assets[asset].balance);
                    }
                }
            })

            // get create unique addresses
            // for (let i = 0; i < addresses.length; i++) {
            //     let addressID = addresses[i].address;
            //     if (addressesMap[addressID]) {
            //         console.log("redundant Address", addressID);
            //     } else {
            //         addressesMap[addressID] = addresses[i];
            //     }
            // }
            // console.log("addressesMap", addressesMap);

            // let sorted = Object.values(addressesMap).map((addressData: IAddressData) => {
            let sorted = Object.values(addresses).map((addressData: IAddressData) => {

                let address: IAddress = {
                    address: addressData.address,
                    publicKey: addressData.publicKey,
                    assets: [],
                    avaxBalance: 0
                }
                
                // let totalTransactionCount = 0;
                // let totalUtxoCount = 0;
                
                for (const asset in addressData.assets) {
                    if (asset === "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA") {
                        console.log("I hold AVAX:", addressData.assets[asset].balance);
                        address.avaxBalance = parseInt(addressData.assets[asset].balance);
                    }
                }
                // assets[asset].name = this.assetsMap[asset].name;
                // assets[asset].denomination = this.assetsMap[asset].denomination;
                // assets[asset].symbol = this.assetsMap[asset].symbol;
                // assets[asset].currentSupply = this.assetsMap[asset].currentSupply;
                // assets[asset].balance = stringToBig(assets[asset].balance, assets[asset].denomination);
                // assets[asset].totalReceived = stringToBig(assets[asset].totalReceived, assets[asset].denomination);
                // assets[asset].totalSent = stringToBig(assets[asset].totalSent, assets[asset].denomination);
                // assets[asset].proportionOfCurrentSupply = ((parseInt(assets[asset].balance) / parseInt(assets[asset].currentSupply)) * 100).toFixed(2);
                // totalTransactionCount += assets[asset].transactionCount;
                // totalUtxoCount += assets[asset].utxoCount;
                // }
                
                // count number of transactions across all
                // count number of UTXOs across all
                // count number of asset types
                // let count = 0;
                // for (const k in address.assets) {
                //     // eslint-disable-next-line
                //     if (address.assets.hasOwnProperty(k)) {
                //         count++;
                //     }
                // }
                // console.log("# of assets", count);
                return address;
            });
            console.log("sorted", sorted);
            sorted.sort((a: IAddress, b: IAddress) => (b.avaxBalance - a.avaxBalance));
            this.addressesList = sorted;
        });
    }

    get addressesLoaded() {
        return true;
    }

    get addresses() {
        return {};
    }

    get totalAddresses() {
        return this.addressesList.length;
    }
}
</script>

<style scoped lang="scss">
@use "../main";

.addresses {
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

@include main.device_s {
    .table_headers {
        display: none;
    }
}
</style>
