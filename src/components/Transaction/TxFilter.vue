<template>
    <div class="transactions-filter left">
        <h4>Filter Results</h4>
        <div>
            <div>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ChainMap } from '@/known_blockchains'

@Component({})
export default class TxFilter extends Vue {
    @Prop() chains!: ChainMap[]
    items: any[] = []
    selection: any[] = []

    created() {
        this.items = this.chains.map((chain: ChainMap) => ({
            id: chain.id,
            name: `${chain.name} (${chain.fullname})`,
            children: chain.txTypes.map((type) => ({
                id: type[0],
                name: type[1].long,
            })),
        }))

        this.selection = this.items.flatMap((item) => item.children)

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
    padding-left: 6px;
}

h4 {
    margin-top: 0;
    line-height: 1.35em;
}
</style>
