<template>
    <v-card id="address_data_table">
        <v-card-title v-if="title">
            {{ title }}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
            :items="addresses"
            :headers="headers"
            multi-sort
            :mobile-breakpoint="0"
        >
            <template #item.address="{ item }">
                <div>
                    <template v-if="links">
                        <router-link
                            :to="`/address/${item.address}`"
                            class="id"
                            >{{ item.address }}</router-link
                        >
                    </template>
                    <template v-else>{{ item.address }}</template>
                </div>
            </template>
            <template #item.avaxBalance="{ item }">
                {{ item.avaxBalance }}
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IAddress } from '@/services/addresses/models'

@Component({
    components: {},
})
export default class AddressDataTable extends Vue {
    @Prop() addresses!: IAddress[]
    @Prop() links?: boolean
    @Prop() title?: string

    get headers(): any[] {
        return [
            { text: 'Address', value: 'address' },
            { text: 'AVAX Balance', value: 'avaxBalance' },
        ]
    }
}
</script>

<style scoped lang="scss">
.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 8px;
    vertical-align: middle;
}

.id_overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 0.825em;
    color: $gray;
    line-height: 1em;
}

@include smOnly {
}

@include xsOrSmaller {
}
</style>

<style lang="scss">
#address_data_table {
    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }

    .v-select.v-text-field input {
        border-color: transparent;
    }
}
</style>
