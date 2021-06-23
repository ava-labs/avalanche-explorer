<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" icon color="pink" v-on="on">
                    <v-icon>mdi-eye-off</v-icon>
                </v-btn>
            </template>
            <v-card>
                <!-- TOOLBAR -->
                <v-toolbar>
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Filters</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <!-- BODY -->
                <v-list>
                    <TxFilter :chains="chains" @change="setFilter" />
                </v-list>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ChainMap } from '@/known_blockchains'
import TxFilter from '@/components/Transaction/TxFilter.vue'

@Component({ components: { TxFilter } })
export default class TxFilterDialog extends Vue {
    @Prop() chains!: ChainMap[]
    dialog = false
    notifications = false
    sound = true
    widgets = false
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

    // simply passes value through to the data request layer above
    setFilter(val: string[]) {
        this.$emit('change', val)
        this.dialog = false
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
