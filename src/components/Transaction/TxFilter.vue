<template>
    <div class="transactions-filter left">
        <h4>Filter Results</h4>
        <div>
            <div>
                <h5>Filter by Chain and Tx Type</h5>
                <v-treeview
                    v-model="selection"
                    selectable
                    :selection-type="'leaf'"
                    selected-color="#e84970"
                    item-disabled="locked"
                    :items="items"
                    return-object
                    open-all
                ></v-treeview>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { CCHAINID, PCHAINID, XCHAINID } from '@/known_blockchains'

@Component({})
export default class TxFilter extends Vue {
    items = [
        {
            id: PCHAINID,
            name: 'P-Chain (Platform)',
            children: [
                { id: 'add_validator', name: 'Add Validator' },
                { id: 'add_subnet_validator', name: 'Add Subnet Validator' },
                { id: 'add_delegator', name: 'Add Delegator' },
                { id: 'create_subnet', name: 'Create Subnet' },
                { id: 'create_chain', name: 'Create Chain' },
                { id: 'pvm_export', name: 'PVM Export' },
                { id: 'pvm_import', name: 'PVM Import' },
            ],
        },
        {
            id: XCHAINID,
            name: 'X-Chain (Exchange)',
            children: [
                { id: 'base', name: 'Base' },
                { id: 'create_asset', name: 'Create Asset' },
                { id: 'operation', name: 'Operation' },
                { id: 'import', name: 'Import' },
                { id: 'export', name: 'Export' },
            ],
        },
        {
            id: CCHAINID,
            name: 'C-Chain (Contract)',
            children: [
                { id: 'atomic_import_tx', name: 'Atomic Import' },
                { id: 'atomic_export_tx', name: 'Atomic Export' },
            ],
        },
    ]

    selection = this.items.flatMap((item) => item.children)

    created() {
        this.$emit(
            'change',
            this.selection.map((val) => val.id)
        )
    }

    @Watch('selection')
    onSelectionChanged() {
        this.$emit(
            'change',
            this.selection.map((val) => val.id)
        )
    }
}
</script>

<style scoped lang="scss">
.transactions-filter {
    font-size: 12px;
}

h4 {
    margin-top: 0;
}
</style>
