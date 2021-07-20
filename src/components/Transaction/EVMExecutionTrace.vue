<template>
    <div>
        <v-treeview
            v-model="items"
            :items="items"
            return-object
            open-all
        ></v-treeview>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import 'reflect-metadata'

@Component({
    components: {},
    filters: {},
})
export default class EVMExecutionTrace extends Vue {
    @Prop() traces!: any[]

    items: any[] = []

    created() {
        this.items = this.traces
    }
}
</script>

<style scoped lang="scss"></style>
