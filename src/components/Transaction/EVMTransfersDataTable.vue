<template>
    <div id="evm_tx_data_table">
        <v-card-title v-if="title">
            {{ title }}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
            :items="transfers"
            :headers="headers"
            multi-sort
            :mobile-breakpoint="0"
        >
            <template #item.v="{ item }">
                <div>
                    <router-link
                        class="id_overflow"
                        :to="`/evmaddress/${item.v}`"
                        >{{ item.v }}</router-link
                    >
                </div>
            </template>
            <template #item.to="{ item }">
                <div>
                    <router-link
                        class="id_overflow"
                        :to="`/evmaddress/${item.to}`"
                        >{{ item.to }}</router-link
                    >
                </div>
            </template>
            <!-- <template #item.value="{ item }">
                <div>
                    <span class="amount"></span>
                    <span class="token_name"></span>
                    (<span class="token_symbol"></span>)
                </div>
            </template> -->
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
    components: {},
})
export default class EVMTransfersDataTable extends Vue {
    @Prop() transfers!: any[]
    @Prop() title?: string

    get headers(): any[] {
        const headers = [
            { text: 'From', value: 'v' },
            { text: 'To', value: 'to' },
            // { text: 'Value', value: 'value' },
        ]
        return headers
    }
}
</script>

<style scoped lang="scss">
.id_overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 12px;
    color: $gray;
    line-height: 1em;
}
@include smOnly {
}

@include xsOrSmaller {
}
</style>

<style lang="scss">
#evm_tx_data_table {
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
