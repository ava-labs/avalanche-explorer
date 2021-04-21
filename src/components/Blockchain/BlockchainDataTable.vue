<template>
    <div id="blockchain_data_table">
        <v-card-title v-if="title">
            {{ title }}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table :items="blockchains" :headers="headers" multi-sort>
            <template #item.name="{ item }">
                <div>
                    <img
                        class="table_image"
                        :src="require(`@/assets/blockchain-${imgColor}.png`)"
                        alt
                    />
                    <template v-if="links">
                        <router-link
                            :to="`/blockchain/${item.id}`"
                            class="id"
                            >{{ item.name }}</router-link
                        >
                    </template>
                    <template v-else>{{ item.name }}</template>
                </div>
            </template>
            <template #item.vmID="{ item }">
                <div>
                    <a :href="vmDocumentation(item.vmID)">{{
                        vm(item.vmID)
                    }}</a>
                </div>
            </template>
            <template #item.indexed="{ item }">
                <Indexed
                    :indexed="item.indexed"
                    :not-indexed-label="false"
                ></Indexed>
            </template>
            <template #item.addressCount="{ item }">
                <div>{{ item.addressCount }}</div>
            </template>
            <template #item.txCount="{ item }">
                <div>{{ item.txCount }}</div>
            </template>
            <template #item.subnetID="{ item }">
                <div>
                    <router-link :to="`/subnet/${item.subnetID}`">{{
                        item.subnetID | subnet
                    }}</router-link>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { subnetMap, VMMap, VMDocumentationMap } from '@/helper'
import Blockchain from '@/js/Blockchain'
import Indexed from '@/components/Blockchain/Indexed.vue'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({
    components: {
        Indexed,
    },
    filters: {
        subnet(val: string): string {
            return subnetMap(val)
        },
    },
})
export default class BlockchainDataTable extends Vue {
    @Prop() blockchains!: Blockchain[]
    @Prop() links?: boolean
    @Prop() subnets?: boolean
    @Prop() title?: string

    get headers(): any[] {
        const headers = [
            { text: 'Name', value: 'name', width: 200, fixed: true },
            { text: 'Virtual Machine', value: 'vmID', width: 125 },
            { text: 'Database Index', value: 'indexed', width: 125 },
            { text: 'Unique Addresses', value: 'addressCount', width: 125 },
            { text: 'Transactions', value: 'txCount', width: 125 },
            { text: 'Subnet', value: 'subnetID', width: 300 },
        ]
        return this.subnets ? headers : headers.slice(0, 3)
    }

    get imgColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'testnet' : 'testnet'
    }

    subnet(val: string) {
        return subnetMap(val)
    }

    vm(val: string) {
        return VMMap(val)
    }

    vmDocumentation(val: string) {
        return VMDocumentationMap(val)
    }
}
</script>

<style scoped lang="scss">
.id_overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 0.825em;
    color: $gray;
    line-height: 1em;
}

.id {
    font-weight: 700;
}

@include smOnly {
}

@include xsOnly {
}
</style>

<style lang="scss">
#blockchain_data_table {
    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }

    .v-select.v-text-field input {
        border-color: transparent;
    }

    .hide {
        display: none;
    }
}
</style>
