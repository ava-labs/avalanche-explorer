<template>
    <div>
        <v-treeview
            v-model="items"
            selectable
            :selection-type="'leaf'"
            selected-color="#000"
            item-disabled="locked"
            :items="items"
            return-object
            open-all
        ></v-treeview>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import 'reflect-metadata'

@Component({
    components: {},
    filters: {},
})
export default class EVMExecutionTrace extends Vue {
    @Prop() traces!: any[]

    items: any[] = []
    selection: any[] = []

    created() {
        this.items = this.traces

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

<style scoped lang="scss"></style>
