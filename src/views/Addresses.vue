<template>
    <div class="addresses">
        <div class="card">
            <div class="header">
                <h2>Addresses</h2>
                <template v-show="!loading && assetsLoaded">
                    <div class="bar">
                        <p class="count">{{totalAddresses.toLocaleString()}} addresses found</p>
                    </div>    
                </template>
            </div>
            <template v-if="loading && !assetsLoaded">
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
import Address from "@/js/Address";

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
            let addresses: IAddressData = res.data.addresses;
            console.log("addresses", addresses);

            // TODO: unique addresses or sort in API
            // let addressesMap: {[key:string]: IAddressData} = {};
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
                    avaxBalance: 0,
                    totalTransactionCount: 0,
                    totalUtxoCount: 0
                }

                if (this.assetsMap) {
                    address = new Address(addressData, this.assetsMap);
                }
                
                return address;
            });
            console.log("sorted", sorted);
            sorted.sort((a: IAddress, b: IAddress) => (b.avaxBalance - a.avaxBalance));
            this.addressesList = sorted;
        });
    }

    get assetsMap() {
        return this.$store.state.assets;
    }

    get assetsLoaded() {
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
