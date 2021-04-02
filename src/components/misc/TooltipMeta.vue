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
export default class TooltipMeta extends Vue {
    @Prop() content!: string
    @Prop() color?: string

    get fillColor(): string {
        return this.color ? this.color : '#d6dae1'
    }
}
</script>
<style scoped lang="scss">
img {
    max-height: 24px;
    height: 0.75em;
    object-fit: contain;
    margin-left: 2px;
    margin-right: 5px;
}
</style>
