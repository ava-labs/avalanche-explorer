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
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </template>
            <v-card>
                <!-- TOOLBAR -->
                <v-toolbar>
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Search</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <!-- BODY -->
                <v-list three-line subheader>
                    <TxParams @change="emitChange" />
                </v-list>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import TxParams from '@/components/Transaction/TxParams.vue'
import { ITransactionParams } from '@/services/transactions'

@Component({
    components: { TxParams },
})
export default class TxParamsDialog extends Vue {
    dialog = false
    notifications = false
    sound = true
    widgets = false

    // simply passes value through to the data request layer above
    emitChange(params: ITransactionParams): void {
        this.$emit('change', params)
        this.dialog = false
    }
}
</script>

<style scoped lang="scss"></style>
