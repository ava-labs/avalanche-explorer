<template>
    <v-tooltip v-if="$vuetify.breakpoint.smAndUp" bottom>
        <template v-slot:activator="{ on }">
            <img :src="require(`@/assets/tooltip.svg`)" v-on="on" />
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
<style scoped lang="scss">
img {
    max-height: 24px;
    height: 0.5em;
    object-fit: contain;
    margin-left: 0.1em;
    margin-right: 0.25em;
    margin-bottom: 0.1em;
}
</style>
