<template>
    <div class="addresses">
        <div class="card">
            <div class="header">
                <h2>Addresses</h2>
                <template v-show="!loading && assetsLoaded">
                    <div class="bar">
                        <p class="count">{{ totalAddresses.toLocaleString() }} {{totalAddresses | pluralize }} found</p>
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
import { Vue, Component } from "vue-property-decorator";
import api from "@/axios";
import Address from "@/js/Address";
import { IAddress, IAddressData, IBalance } from '@/js/IAddress';
import Big from "big.js";
import AddressDataTable from '@/components/Address/AddressDataTable.vue';

@Component({
    components: {
        AddressDataTable
    },
    filters: {
        pluralize(val: number): string {
            return val === 0
                ? `addresses`
                : val > 1
                ? `addresses`
                : `address`;
        }
    }
})

export default class Addresses extends Vue {
    loading: boolean = true;
    addressesList: IAddress[] = [];
    totalAddresses: number = 0;

    async created() {
        this.loading = false;
        api.get("/x/addresses").then(res => {
            this.totalAddresses = res.data.count            
            let addresses: IAddressData = res.data.addresses;

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
            // let sorted = Object.values(addressesMap).map((addressData: IAddressData) => {
            
            let sorted = Object.values(addresses).map((addressData: IAddressData) => {
                let address: IAddress = {
                    address: addressData.address,
                    publicKey: addressData.publicKey,
                    assets: [],
                    avaxBalance: Big(0),
                    totalTransactionCount: 0,
                    totalUtxoCount: 0
                }

                if (this.assetsMap) {
                    address = new Address(addressData, this.assetsMap);
                }
                
                return address;
            });
            sorted.sort((a: IAddress, b: IAddress) => {
                let diff = a.avaxBalance.minus(b.avaxBalance);
                if (diff.gt(0)) return -1;
                else if (diff.lt(0)) return 1;
                else return 0;
            });
            this.addressesList = sorted;
        });
    }

    get assetsMap() {
        return this.$store.state.assets;
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
