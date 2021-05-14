<template>
    <div class="addresses">
        <div class="card">
            <div class="header">
                <h2>Addresses</h2>
                <template v-show="!loading && assetsLoaded">
                    <div class="bar">
                        <p class="count">
                            {{ totalAddresses.toLocaleString() }}
                            {{ totalAddresses | pluralize('address') }} found
                        </p>
                    </div>
                </template>
            </div>
            <template v-if="loading && !assetsLoaded">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </template>
            <template v-else>
                <AddressDataTable
                    :addresses="addressesList"
                    :links="true"
                ></AddressDataTable>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import api from '@/axios'
import { IAddress, IAddressData } from '@/services/addresses/models'
import Big from 'big.js'
import AddressDataTable from '@/components/Address/AddressDataTable.vue'

@Component({
    components: {
        AddressDataTable,
    },
})
export default class Addresses extends Vue {
    loading = true
    addressesList: IAddress[] = []
    totalAddresses = 0

    async created() {
        this.loading = false
        // TODO: support service for multiple chains
        api.get('/x/addresses').then((res) => {
            this.totalAddresses = res.data.count
            const addresses: IAddressData = res.data.addresses
            const sorted = Object.values(addresses).map(
                (addressData: IAddressData) => {
                    const address: IAddress = {
                        address: addressData.address,
                        publicKey: addressData.publicKey,
                        // P-Chain AVAX balance
                        AVAX_balance: Big(0),
                        P_unlocked: Big(0),
                        P_lockedStakeable: Big(0),
                        P_lockedNotStakeable: Big(0),
                        P_staked: Big(0),
                        P_utxoIDs: [],
                        // X-Chain AVAX balance
                        X_unlocked: Big(0),
                        X_locked: Big(0),
                        // X-Chain Assets
                        assets: [],
                    }

                    return address
                }
            )
            sorted.sort((a: IAddress, b: IAddress) => {
                const diff = a.X_unlocked.minus(b.X_unlocked)
                if (diff.gt(0)) return -1
                else if (diff.lt(0)) return 1
                else return 0
            })
            this.addressesList = sorted
        })
    }

    get assetsMap() {
        return this.$store.state.assets
    }
}
</script>

<style scoped lang="scss">
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

@include smOnly {
    .table_headers {
        display: none;
    }
}
</style>
