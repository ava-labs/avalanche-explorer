<template>
    <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
        <template v-slot:activator="{ on }">
            <fa
                v-on="on"
                icon="info-circle"
                transform="shrink-6"
                :style="{ color: fillColor }"
            ></fa>
        </template>
        <span>{{ content }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class TooltipMeta extends Vue {
    @Prop() content!: string
    @Prop() color?: string

    get fillColor(): string {
        return this.color ? this.color : '#2196f3'
    }
}
</script>
