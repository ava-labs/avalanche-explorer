<template>
    <div id="evm_tx_data_table">
        <v-card-title v-if="title">
            {{ title }}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
            :items="transactions"
            :headers="headers"
            multi-sort
            :mobile-breakpoint="0"
        >
            <template #item.type="{ item }">{{ item.type }}</template>
            <template #item.hash="{ item }">
                <div>
                    <router-link
                        class="id_overflow"
                        :to="`/evmtx/${item.hash}`"
                        >{{ item.hash }}</router-link
                    >
                </div>
            </template>
            <template #item.v="{ item }">
                <div>
                    <router-link
                        class="id_overflow"
                        :to="`/evmaddress/${item.v}`"
                        >{{ item.v }}</router-link
                    >
                </div>
            </template>
            <template #item.value="{ item }">
                <div>{{ item.value }} AVAX</div>
            </template>
            <template #item.input="{ item }">
                <div>
                    <span class="id_overflow">{{ item.input }}</span>
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
            <template #item.gasPrice="{ item }">
                <div>{{ item.gasPrice }} AVAX</div>
            </template>
            <template #item.gas="{ item }">
                <div>{{ item.gas.toLocaleString() }}</div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { EVMBlockTransaction } from '@/store/modules/blocks'

@Component({
    components: {},
})
export default class EVMTxDataTable extends Vue {
    @Prop() transactions!: EVMBlockTransaction[]
    @Prop() title?: string

    get headers(): any[] {
        const headers = [
            { text: 'Type', value: 'type', width: 50 },
            { text: 'ID', value: 'hash', width: 50 },
            { text: 'From', value: 'v', width: 50 },
            { text: 'Value', value: 'value', width: 50 },
            { text: 'Input', value: 'input', width: 100 },
            { text: 'To', value: 'to' },
            { text: 'Gas Price', value: 'gasPrice', width: 100 },
            { text: 'Gas Used', value: 'gas', width: 100 },
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
