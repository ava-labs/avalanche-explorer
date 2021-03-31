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
                    selected-color="#000"
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
import { P, X, C } from '@/known_blockchains'

@Component({})
export default class TxFilter extends Vue {
    items = [
        {
            id: P.id,
            name: `${P.name} (${P.fullname})`,
            children: P.txTypes.map((type) => ({
                id: type[0],
                name: type[1].long,
            })),
        },
        {
            id: X.id,
            name: `${X.name} (${X.fullname})`,
            children: X.txTypes.map((type) => ({
                id: type[0],
                name: type[1].long,
            })),
        },
        {
            id: C.id,
            name: `${C.name} (${C.fullname})`,
            children: C.txTypes.map((type) => ({
                id: type[0],
                name: type[1].long,
            })),
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
