<template>
    <v-tooltip v-if="$vuetify.breakpoint.smAndUp" bottom>
        <template v-slot:activator="{ on }">
            <fa
                icon="info-circle"
                transform="shrink-8"
                :style="{ color: fillColor }"
                v-on="on"
            ></fa>
        </template>
        <span>{{ content }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class TooltipHeading extends Vue {
    @Prop() content!: string
    @Prop() color?: string

    get fillColor(): string {
        return this.color ? this.color : '#2196f3'
    }
}
</script>
